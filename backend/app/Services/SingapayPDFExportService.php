<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class SingapayPDFExportService
{
    protected $apiUrl;
    protected $partnerId;
    protected $clientId;
    protected $clientSecret;
    protected $accessToken;
    protected $accessTokenExpiry;

    public function __construct()
    {
        // [CUSTOMIZATION_ENDPOINT] - Ganti sesuai environment
        $this->apiUrl = config('services.singapay.api_url', 'https://sandbox-payment-b2b.singapay.id');
        
        // [CUSTOMIZATION_CREDENTIALS] - Ganti dengan credentials dari Singapay
        $this->partnerId = config('services.singapay.partner_id');
        $this->clientId = config('services.singapay.client_id');
        $this->clientSecret = config('services.singapay.client_secret');
    }

    /**
     * Get Access Token untuk API calls
     * [CUSTOMIZATION_AUTH] - Verifikasi signature logic sesuai docs Singapay
     */
    public function getAccessToken()
    {
        try {
            // Check jika token masih valid
            if ($this->accessToken && $this->accessTokenExpiry && now()->isBefore($this->accessTokenExpiry)) {
                return $this->accessToken;
            }

            $timestamp = now()->format('Ymd');
            $payloadData = $this->clientId . '_' . $this->clientSecret . '_' . $timestamp;
            $signature = hash_hmac('sha512', $payloadData, $this->clientSecret);

            $response = Http::withBasicAuth($this->partnerId, $this->clientSecret)
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'X-CLIENT-ID' => $this->clientId,
                    'X-Signature' => $signature,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($this->apiUrl . '/api/v1.1/access-token/b2b', [
                    'grantType' => 'client_credentials'
                ]);

            if ($response->failed()) {
                Log::error('Singapay: Failed to get access token', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new Exception('Failed to get access token from Singapay');
            }

            $data = $response->json();
            $this->accessToken = $data['accessToken'] ?? null;
            $this->accessTokenExpiry = now()->addSeconds($data['expiresIn'] - 60);

            Log::info('Singapay: Access token obtained successfully');
            return $this->accessToken;
        } catch (Exception $e) {
            Log::error('Singapay: Exception getting access token', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Create Virtual Account untuk payment
     * [CUSTOMIZATION_BANK] - Pilih bank: BRI, BNI, DANAMON, MAYBANK
     */
    public function createVirtualAccount($accountId, $amount, $bankCode = 'BRI', $isTemporary = false, $expiryDate = null)
    {
        try {
            $token = $this->getAccessToken();

            $payload = [
                'bank_code' => $bankCode,
                'amount' => $amount,
                'is_permanent' => !$isTemporary,
                'is_single_use' => $isTemporary,
                'currency' => 'IDR'
            ];

            if ($isTemporary && $expiryDate) {
                $payload['expired_at'] = $expiryDate;
                $payload['max_usage'] = 1; // One-time use
            }

            $response = Http::withToken($token)
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($this->apiUrl . "/api/v1.0/virtual-accounts/{$accountId}", $payload);

            if ($response->failed()) {
                Log::error('Singapay: Failed to create VA', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new Exception('Failed to create virtual account');
            }

            $data = $response->json();
            Log::info('Singapay: VA created successfully', [
                'account_id' => $accountId,
                'va_number' => $data['virtual_account_number'] ?? null
            ]);

            return [
                'status' => 'success',
                'va_number' => $data['virtual_account_number'],
                'bank_code' => $bankCode,
                'amount' => $amount,
                'is_permanent' => !$isTemporary,
                'expired_at' => $expiryDate,
                'created_at' => now()
            ];
        } catch (Exception $e) {
            Log::error('Singapay: Exception creating VA', [
                'message' => $e->getMessage(),
                'account_id' => $accountId
            ]);
            throw $e;
        }
    }

    /**
     * Generate QRIS untuk payment
     * [CUSTOMIZATION_QRIS] - Configure QRIS parameters
     */
    public function generateQRIS($amount, $description = 'Payment')
    {
        try {
            $token = $this->getAccessToken();

            $payload = [
                'amount' => $amount,
                'description' => $description,
                'currency' => 'IDR',
                'is_single_use' => false, // Reusable QRIS
                'expired_at' => now()->addDays(7)->toIso8601String()
            ];

            $response = Http::withToken($token)
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($this->apiUrl . '/api/v1.0/qris', $payload);

            if ($response->failed()) {
                Log::error('Singapay: Failed to generate QRIS', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new Exception('Failed to generate QRIS');
            }

            $data = $response->json();
            Log::info('Singapay: QRIS generated successfully');

            return [
                'status' => 'success',
                'qr_data' => $data['qr_data'],
                'qr_url' => $data['qr_url'],
                'amount' => $amount,
                'expired_at' => $data['expired_at']
            ];
        } catch (Exception $e) {
            Log::error('Singapay: Exception generating QRIS', [
                'message' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Generate Payment Link untuk invoice/email
     * [CUSTOMIZATION_LINK] - Customize payment link properties
     */
    public function generatePaymentLink($amount, $orderId, $customerEmail = null, $description = 'Payment')
    {
        try {
            $token = $this->getAccessToken();

            $payload = [
                'amount' => $amount,
                'reference_id' => $orderId,
                'description' => $description,
                'currency' => 'IDR',
                'customer_email' => $customerEmail,
                'expired_at' => now()->addDays(30)->toIso8601String(),
                'payment_methods' => ['va', 'qris', 'ew'], // VA, QRIS, E-wallet
                'redirect_url' => config('app.url') . '/payment/callback'
            ];

            $response = Http::withToken($token)
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'Accept' => 'application/json',
                    'Content-Type' => 'application/json',
                ])
                ->post($this->apiUrl . '/api/v1.0/payment-links', $payload);

            if ($response->failed()) {
                Log::error('Singapay: Failed to generate payment link', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new Exception('Failed to generate payment link');
            }

            $data = $response->json();
            Log::info('Singapay: Payment link generated successfully', [
                'order_id' => $orderId
            ]);

            return [
                'status' => 'success',
                'link' => $data['link'],
                'link_id' => $data['link_id'],
                'amount' => $amount,
                'expired_at' => $data['expired_at']
            ];
        } catch (Exception $e) {
            Log::error('Singapay: Exception generating payment link', [
                'message' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Check transaction status
     */
    public function checkTransactionStatus($transactionId)
    {
        try {
            $token = $this->getAccessToken();

            $response = Http::withToken($token)
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'Accept' => 'application/json',
                ])
                ->get($this->apiUrl . "/api/v1.0/transactions/{$transactionId}");

            if ($response->failed()) {
                Log::error('Singapay: Failed to check transaction status', [
                    'transaction_id' => $transactionId,
                    'status' => $response->status()
                ]);
                throw new Exception('Failed to check transaction status');
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Singapay: Exception checking transaction status', [
                'message' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Validate webhook signature dari Singapay
     * [CUSTOMIZATION_WEBHOOK] - Verify webhook authenticity
     */
    public static function validateWebhookSignature($payload, $signature)
    {
        try {
            $clientSecret = config('services.singapay.client_secret');
            $expectedSignature = hash_hmac('sha512', $payload, $clientSecret);

            if (!hash_equals($expectedSignature, $signature)) {
                Log::warning('Singapay: Invalid webhook signature');
                return false;
            }

            Log::info('Singapay: Webhook signature validated');
            return true;
        } catch (Exception $e) {
            Log::error('Singapay: Exception validating webhook signature', [
                'message' => $e->getMessage()
            ]);
            return false;
        }
    }

    /**
     * Get account balance
     */
    public function getAccountBalance($accountId)
    {
        try {
            $token = $this->getAccessToken();

            $response = Http::withToken($token)
                ->withHeaders([
                    'X-PARTNER-ID' => $this->partnerId,
                    'Accept' => 'application/json',
                ])
                ->get($this->apiUrl . "/api/v1.0/accounts/{$accountId}/balance");

            if ($response->failed()) {
                Log::error('Singapay: Failed to get account balance', [
                    'account_id' => $accountId
                ]);
                throw new Exception('Failed to get account balance');
            }

            return $response->json();
        } catch (Exception $e) {
            Log::error('Singapay: Exception getting account balance', [
                'message' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
