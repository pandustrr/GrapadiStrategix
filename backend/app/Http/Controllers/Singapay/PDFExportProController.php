<?php

namespace App\Http\Controllers;

use App\Services\SingapayPDFExportService;
use App\Models\PDFExportRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Exception;

class PDFExportProController extends Controller
{
    protected $singapayService;

    public function __construct(SingapayPDFExportService $singapayService)
    {
        $this->singapayService = $singapayService;
    }

    /**
     * Create export request dan generate Virtual Account untuk pembayaran
     * [CUSTOMIZATION_VA] - Customize bank selection dan amount
     */
    public function createExportRequest(Request $request)
    {
        try {
            $request->validate([
                'export_type' => 'required|in:business_plan,financial_plan,forecast',
                'business_id' => 'required|integer',
                'package' => 'required|in:professional,business',
                'year' => 'nullable|integer',
                'month' => 'nullable|integer',
            ]);

            $userId = Auth::id();
            
            // [CUSTOMIZATION_PRICING] - Sesuaikan harga per package
            $pricing = [
                'professional' => 50000,
                'business' => 100000,
            ];

            $amount = $pricing[$request->package] ?? 50000;

            // Create export request record
            $exportRequest = PDFExportRequest::create([
                'user_id' => $userId,
                'export_type' => $request->export_type,
                'business_id' => $request->business_id,
                'package' => $request->package,
                'amount' => $amount,
                'year' => $request->year,
                'month' => $request->month,
                'status' => 'pending_payment',
                'payment_method' => 'virtual_account',
            ]);

            Log::info('PDF Export Request created', [
                'export_id' => $exportRequest->id,
                'user_id' => $userId,
                'amount' => $amount
            ]);

            // Generate Virtual Account untuk pembayaran
            // [CUSTOMIZATION_SINGAPAY_ACCOUNT] - Ganti dengan account ID dari Singapay
            $singapayAccountId = config('services.singapay.merchant_account_id', 'default_account');
            
            $vaResult = $this->singapayService->createVirtualAccount(
                $singapayAccountId,
                $amount,
                'BRI', // [CUSTOMIZATION_BANK] - Pilih bank
                false, // permanent VA
                null
            );

            if ($vaResult['status'] !== 'success') {
                throw new Exception('Failed to create virtual account');
            }

            // Update export request dengan VA details
            $exportRequest->update([
                'payment_va_number' => $vaResult['va_number'],
                'payment_va_bank' => $vaResult['bank_code'],
                'singapay_reference_id' => $vaResult['va_number'],
                'payment_expires_at' => now()->addDays(3),
            ]);

            Log::info('Virtual Account created for export request', [
                'export_id' => $exportRequest->id,
                'va_number' => $vaResult['va_number']
            ]);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'export_request_id' => $exportRequest->id,
                    'va_number' => $vaResult['va_number'],
                    'bank' => $vaResult['bank_code'],
                    'amount' => $amount,
                    'expires_at' => $exportRequest->payment_expires_at,
                    'reference_id' => $exportRequest->id,
                    'instructions' => "Silakan transfer ke nomor Virtual Account: {$vaResult['va_number']} sebesar Rp " . number_format($amount, 0, ',', '.'),
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error creating export request', [
                'message' => $e->getMessage(),
                'user_id' => Auth::id()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat request export: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate alternative payment options (QRIS, Payment Link)
     */
    public function generatePaymentOptions(Request $request)
    {
        try {
            $request->validate([
                'export_request_id' => 'required|integer',
                'payment_method' => 'required|in:qris,payment_link',
            ]);

            $exportRequest = PDFExportRequest::findOrFail($request->export_request_id);

            // Verify ownership
            if ($exportRequest->user_id !== Auth::id()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }

            $result = null;

            if ($request->payment_method === 'qris') {
                // [CUSTOMIZATION_QRIS] - Generate QRIS code
                $result = $this->singapayService->generateQRIS(
                    $exportRequest->amount,
                    "PDF Export - {$exportRequest->export_type}"
                );

                $exportRequest->update([
                    'payment_qris_data' => $result['qr_data'],
                    'payment_method' => 'qris',
                ]);

                Log::info('QRIS generated for export request', [
                    'export_id' => $exportRequest->id
                ]);
            } elseif ($request->payment_method === 'payment_link') {
                // [CUSTOMIZATION_LINK] - Generate payment link
                $result = $this->singapayService->generatePaymentLink(
                    $exportRequest->amount,
                    "export-{$exportRequest->id}",
                    Auth::user()->email,
                    "PDF Export - {$exportRequest->export_type}"
                );

                $exportRequest->update([
                    'payment_link' => $result['link'],
                    'payment_method' => 'payment_link',
                ]);

                Log::info('Payment link generated for export request', [
                    'export_id' => $exportRequest->id
                ]);
            }

            return response()->json([
                'status' => 'success',
                'data' => $result
            ]);
        } catch (Exception $e) {
            Log::error('Error generating payment options', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal generate payment option: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check payment status
     */
    public function checkPaymentStatus(Request $request)
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

            // Check status dari database (updated by webhook)
            return response()->json([
                'status' => 'success',
                'data' => [
                    'export_request_id' => $exportRequest->id,
                    'payment_status' => $exportRequest->status,
                    'amount' => $exportRequest->amount,
                    'va_number' => $exportRequest->payment_va_number,
                    'paid_at' => $exportRequest->paid_at,
                    'pdf_download_url' => $exportRequest->pdf_download_url,
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error checking payment status', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal check payment status'
            ], 500);
        }
    }

    /**
     * Download exported PDF (hanya setelah payment sukses)
     */
    public function downloadPDF(Request $request)
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

            // Check if payment sudah sukses
            if ($exportRequest->status !== 'completed') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment belum selesai atau PDF belum ready'
                ], 403);
            }

            // Check if PDF file exists
            if (!$exportRequest->pdf_path || !file_exists(storage_path('app/' . $exportRequest->pdf_path))) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'PDF file not found'
                ], 404);
            }

            // Return PDF download link (base64 atau direct)
            return response()->json([
                'status' => 'success',
                'data' => [
                    'filename' => $exportRequest->pdf_filename,
                    'download_url' => route('pdf-export.download-file', ['export_request_id' => $exportRequest->id])
                ]
            ]);
        } catch (Exception $e) {
            Log::error('Error downloading PDF', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal download PDF'
            ], 500);
        }
    }

    /**
     * Get pricing & package info
     */
    public function getPackagePricing()
    {
        // [CUSTOMIZATION_PRICING] - Customize packages dan features
        $packages = [
            'free' => [
                'name' => 'Standard (Free)',
                'price' => 0,
                'features' => [
                    'Basic PDF export',
                    'Watermark included',
                    'Standard formatting',
                ],
                'download_available' => true,
                'watermark' => true,
            ],
            'professional' => [
                'name' => 'Professional',
                'price' => 50000,
                'features' => [
                    'Professional PDF export',
                    'No watermark',
                    'Premium formatting',
                    'Advanced charts',
                    'Custom branding',
                ],
                'download_available' => true,
                'watermark' => false,
            ],
            'business' => [
                'name' => 'Business',
                'price' => 100000,
                'features' => [
                    'All Professional features',
                    'Priority support',
                    'Multiple exports',
                    'Team collaboration',
                    'API access',
                    'Custom integration',
                ],
                'download_available' => true,
                'watermark' => false,
            ],
        ];

        return response()->json([
            'status' => 'success',
            'data' => $packages
        ]);
    }

    /**
     * Get export request history
     */
    public function getExportHistory()
    {
        try {
            $userId = Auth::id();

            $exports = PDFExportRequest::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->paginate(10);

            return response()->json([
                'status' => 'success',
                'data' => $exports
            ]);
        } catch (Exception $e) {
            Log::error('Error getting export history', [
                'message' => $e->getMessage()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Gagal get export history'
            ], 500);
        }
    }
}
