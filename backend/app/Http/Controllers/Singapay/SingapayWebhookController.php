<?php

namespace App\Http\Controllers;

use App\Models\PDFExportRequest;
use App\Models\SingapayPayment;
use App\Services\SingapayPDFExportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class SingapayWebhookController extends Controller
{
    protected $singapayService;

    public function __construct(SingapayPDFExportService $singapayService)
    {
        $this->singapayService = $singapayService;
    }

    /**
     * Handle Singapay webhook for payment settlement
     *
     * Singapay akan mengirim notifikasi ke endpoint ini ketika:
     * - VA terisi (Virtual Account Settlement)
     * - QRIS code dibayar
     * - Payment Link sukses
     */
    public function handlePaymentSettlement(Request $request)
    {
        try {
            // Log webhook untuk debugging
            Log::info('Singapay webhook received', [
                'payload' => $request->all(),
                'headers' => $request->headers->all(),
            ]);

            // Validate webhook signature
            // [CUSTOMIZATION_WEBHOOK_SECRET] - Sesuaikan dengan Singapay webhook secret
            $webhookSecret = config('services.singapay.webhook_secret', '#SINGAPAY_WEBHOOK_SECRET#');

            $isValid = $this->validateWebhookSignature($request, $webhookSecret);

            if (!$isValid) {
                Log::warning('Invalid webhook signature', [
                    'ip' => $request->ip(),
                    'signature' => $request->header('X-Singapay-Signature')
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid signature'
                ], 401);
            }

            // Extract payment data
            $referenceId = $request->input('reference_id') ?? $request->input('external_id');
            $transactionId = $request->input('transaction_id') ?? $request->input('id');
            $status = $request->input('status') ?? $request->input('state');
            $amount = $request->input('amount');
            $paymentMethod = $request->input('payment_method') ?? 'virtual_account';

            Log::info('Processing webhook payment', [
                'reference_id' => $referenceId,
                'transaction_id' => $transactionId,
                'status' => $status,
                'amount' => $amount,
            ]);

            // Find export request
            $exportRequest = PDFExportRequest::where('singapay_reference_id', $referenceId)
                ->orWhere('id', $referenceId)
                ->first();

            if (!$exportRequest) {
                Log::warning('Export request not found', [
                    'reference_id' => $referenceId
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Export request not found'
                ], 404);
            }

            // Validate amount
            if ((int)$amount !== $exportRequest->amount) {
                Log::warning('Amount mismatch', [
                    'expected' => $exportRequest->amount,
                    'received' => $amount
                ]);

                return response()->json([
                    'status' => 'error',
                    'message' => 'Amount mismatch'
                ], 400);
            }

            // Update or create Singapay payment record
            $singapayPayment = SingapayPayment::updateOrCreate(
                ['reference_id' => $referenceId],
                [
                    'export_request_id' => $exportRequest->id,
                    'singapay_transaction_id' => $transactionId,
                    'amount' => $amount,
                    'payment_method' => $paymentMethod,
                    'status' => $this->mapSingapayStatus($status),
                    'webhook_data' => $request->all(),
                    'paid_at' => $this->mapSingapayStatus($status) === 'settled' ? now() : null,
                ]
            );

            // [CUSTOMIZATION_WEBHOOK_STATUS] - Sesuaikan status mapping dengan Singapay
            // Handle different payment statuses
            if ($this->mapSingapayStatus($status) === 'settled') {
                // Payment settled - update export request
                $exportRequest->update([
                    'status' => 'completed',
                    'paid_at' => now(),
                ]);

                Log::info('Export request marked as completed', [
                    'export_request_id' => $exportRequest->id,
                    'singapay_transaction_id' => $transactionId
                ]);

                // Queue job untuk generate PDF (async)
                // [CUSTOMIZATION_PDF_GENERATION] - Uncomment untuk auto-generate PDF
                // dispatch(new GeneratePDFExportJob($exportRequest->id));

                // Send confirmation email ke user
                $this->sendPaymentConfirmationEmail($exportRequest);

            } elseif ($this->mapSingapayStatus($status) === 'failed') {
                // Payment failed
                $exportRequest->update([
                    'status' => 'failed',
                ]);

                Log::warning('Payment failed', [
                    'export_request_id' => $exportRequest->id,
                    'singapay_transaction_id' => $transactionId
                ]);

                $this->sendPaymentFailedEmail($exportRequest);
            }

            // Return success to Singapay
            return response()->json([
                'status' => 'success',
                'message' => 'Webhook processed'
            ]);

        } catch (Exception $e) {
            Log::error('Error handling Singapay webhook', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error'
            ], 500);
        }
    }

    /**
     * Validate webhook signature menggunakan HMAC SHA256
     * [CUSTOMIZATION_SIGNATURE_VALIDATION] - Sesuaikan algoritma dengan Singapay
     */
    protected function validateWebhookSignature(Request $request, $webhookSecret)
    {
        $signature = $request->header('X-Singapay-Signature');

        if (!$signature) {
            return false;
        }

        // Get request body
        $body = $request->getContent();

        // Generate expected signature menggunakan HMAC SHA256
        $expectedSignature = hash_hmac('sha256', $body, $webhookSecret);

        // Compare signatures (timing-safe comparison)
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Map Singapay status ke internal status
     * [CUSTOMIZATION_STATUS_MAPPING] - Sesuaikan dengan Singapay status values
     */
    protected function mapSingapayStatus($singapayStatus)
    {
        $mapping = [
            'SETTLEMENT' => 'settled',
            'settled' => 'settled',
            'PAID' => 'settled',
            'COMPLETED' => 'settled',
            'SUCCESS' => 'settled',

            'PENDING' => 'pending',
            'WAITING_CONFIRMATION' => 'pending',

            'FAILED' => 'failed',
            'FAILED_TRANSACTION' => 'failed',
            'CANCELLED' => 'cancelled',
            'EXPIRED' => 'cancelled',
        ];

        return $mapping[$singapayStatus] ?? 'pending';
    }

    /**
     * Send payment confirmation email
     */
    protected function sendPaymentConfirmationEmail(PDFExportRequest $exportRequest)
    {
        try {
            // [CUSTOMIZATION_EMAIL] - Implement email notification
            // Mail::send(new PaymentConfirmationMail($exportRequest));

            Log::info('Payment confirmation email sent', [
                'export_request_id' => $exportRequest->id,
                'user_id' => $exportRequest->user_id
            ]);
        } catch (Exception $e) {
            Log::error('Error sending payment confirmation email', [
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Send payment failed email
     */
    protected function sendPaymentFailedEmail(PDFExportRequest $exportRequest)
    {
        try {
            // [CUSTOMIZATION_EMAIL] - Implement email notification
            // Mail::send(new PaymentFailedMail($exportRequest));

            Log::info('Payment failed email sent', [
                'export_request_id' => $exportRequest->id,
                'user_id' => $exportRequest->user_id
            ]);
        } catch (Exception $e) {
            Log::error('Error sending payment failed email', [
                'message' => $e->getMessage()
            ]);
        }
    }

    /**
     * Manual payment status check (fallback untuk polling)
     * Endpoint untuk frontend periodic polling
     */
    public function checkPaymentStatusManual(Request $request)
    {
        try {
            $request->validate([
                'export_request_id' => 'required|integer',
            ]);

            $exportRequest = PDFExportRequest::findOrFail($request->export_request_id);

            // Verify ownership
            if ($exportRequest->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check with Singapay API untuk latest status
            // [CUSTOMIZATION_POLLING] - Implement API polling
            if ($exportRequest->singapay_reference_id) {
                // Query Singapay API untuk update status
                // $status = $this->singapayService->checkPaymentStatus($exportRequest->singapay_reference_id);
            }

            return response()->json([
                'status' => 'success',
                'data' => [
                    'export_request_id' => $exportRequest->id,
                    'status' => $exportRequest->status,
                    'payment_status' => $exportRequest->singapayPayment?->status,
                    'paid_at' => $exportRequest->paid_at,
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error checking payment status manually', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Failed to check payment status'
            ], 500);
        }
    }
}
