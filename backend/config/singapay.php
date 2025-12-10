<?php

/**
 * SINGAPAY CONFIGURATION
 * 
 * Add this to config/services.php file:
 */

return [
    // ... existing services ...
    
    'singapay' => [
        /**
         * [CUSTOMIZATION_ENVIRONMENT]
         * Set to 'sandbox' untuk testing, 'production' untuk live
         */
        'environment' => env('SINGAPAY_ENV', 'sandbox'),
        
        /**
         * [CUSTOMIZATION_PARTNER_ID]
         * Ganti dengan Partner ID dari Singapay
         * Format: numeric ID
         * Example: 123456789
         */
        'partner_id' => env('SINGAPAY_PARTNER_ID', '#SINGAPAY_PARTNER_ID#'),
        
        /**
         * [CUSTOMIZATION_MERCHANT_ACCOUNT_ID]
         * Merchant Account ID untuk Virtual Account generation
         * Didapat dari Singapay dashboard
         */
        'merchant_account_id' => env('SINGAPAY_MERCHANT_ACCOUNT_ID', 'default_account'),
        
        /**
         * [CUSTOMIZATION_CLIENT_ID]
         * OAuth 2.0 Client ID
         * Digunakan untuk mendapatkan access token
         */
        'client_id' => env('SINGAPAY_CLIENT_ID', '#SINGAPAY_CLIENT_ID#'),
        
        /**
         * [CUSTOMIZATION_CLIENT_SECRET]
         * OAuth 2.0 Client Secret
         * JANGAN share atau hardcode! Gunakan environment variable
         */
        'client_secret' => env('SINGAPAY_CLIENT_SECRET', '#SINGAPAY_CLIENT_SECRET#'),
        
        /**
         * [CUSTOMIZATION_SANDBOX_URL]
         * Base URL untuk Singapay Sandbox environment
         * Gunakan untuk testing dan development
         */
        'sandbox_url' => env('SINGAPAY_SANDBOX_URL', 'https://sandbox-payment-b2b.singapay.id'),
        
        /**
         * [CUSTOMIZATION_PRODUCTION_URL]
         * Base URL untuk Singapay Production environment
         * Gunakan untuk live payments
         */
        'production_url' => env('SINGAPAY_PRODUCTION_URL', 'https://payment-b2b.singapay.id'),
        
        /**
         * [CUSTOMIZATION_WEBHOOK_SECRET]
         * Secret key untuk validasi webhook signature
         * Didapat dari Singapay dashboard
         * JANGAN share! Gunakan environment variable
         */
        'webhook_secret' => env('SINGAPAY_WEBHOOK_SECRET', '#SINGAPAY_WEBHOOK_SECRET#'),
        
        /**
         * [CUSTOMIZATION_WEBHOOK_URL]
         * Webhook endpoint URL yang terdaftar di Singapay
         * Format: https://yourdomain.com/api/webhooks/singapay/payment-settlement
         */
        'webhook_url' => env('SINGAPAY_WEBHOOK_URL', 'https://smartplan.local/api/webhooks/singapay/payment-settlement'),
        
        /**
         * [CUSTOMIZATION_TIMEOUT]
         * HTTP request timeout (seconds)
         */
        'timeout' => env('SINGAPAY_TIMEOUT', 30),
        
        /**
         * [CUSTOMIZATION_RETRY]
         * Retry configuration untuk failed requests
         */
        'retry' => [
            'max_attempts' => env('SINGAPAY_RETRY_MAX_ATTEMPTS', 3),
            'retry_delay' => env('SINGAPAY_RETRY_DELAY', 1000), // milliseconds
        ],
        
        /**
         * [CUSTOMIZATION_PAYMENT_METHODS]
         * Enabled payment methods
         */
        'payment_methods' => [
            'virtual_account' => [
                'enabled' => true,
                'banks' => ['BRI', 'BCA', 'MANDIRI', 'BTN'],
                'permanent' => false, // VA bisa digunakan sekali atau multiple times
            ],
            'qris' => [
                'enabled' => true,
                'display_name' => 'QRIS',
            ],
            'payment_link' => [
                'enabled' => true,
                'display_name' => 'Payment Link',
            ],
        ],
        
        /**
         * [CUSTOMIZATION_PRICING]
         * Package pricing configuration
         */
        'pricing' => [
            'free' => [
                'price' => 0,
                'watermark' => true,
            ],
            'professional' => [
                'price' => 50000, // Rp 50.000
                'watermark' => false,
            ],
            'business' => [
                'price' => 100000, // Rp 100.000
                'watermark' => false,
            ],
        ],
        
        /**
         * [CUSTOMIZATION_PAYMENT_EXPIRY]
         * Payment expiry configuration (days)
         */
        'payment_expiry_days' => env('SINGAPAY_PAYMENT_EXPIRY_DAYS', 3),
        
        /**
         * [CUSTOMIZATION_LOGGING]
         * Enable detailed logging untuk debugging
         */
        'logging' => [
            'enabled' => env('SINGAPAY_LOGGING', true),
            'channel' => env('SINGAPAY_LOG_CHANNEL', 'single'),
            'log_requests' => true,
            'log_responses' => true,
            'log_webhooks' => true,
        ],
    ],
];

/**
 * ENVIRONMENT VARIABLES (.env)
 * 
 * SINGAPAY_ENV=sandbox
 * SINGAPAY_PARTNER_ID=#SINGAPAY_PARTNER_ID#
 * SINGAPAY_MERCHANT_ACCOUNT_ID=default_account
 * SINGAPAY_CLIENT_ID=#SINGAPAY_CLIENT_ID#
 * SINGAPAY_CLIENT_SECRET=#SINGAPAY_CLIENT_SECRET#
 * SINGAPAY_SANDBOX_URL=https://sandbox-payment-b2b.singapay.id
 * SINGAPAY_PRODUCTION_URL=https://payment-b2b.singapay.id
 * SINGAPAY_WEBHOOK_SECRET=#SINGAPAY_WEBHOOK_SECRET#
 * SINGAPAY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/singapay/payment-settlement
 * SINGAPAY_TIMEOUT=30
 * SINGAPAY_RETRY_MAX_ATTEMPTS=3
 * SINGAPAY_RETRY_DELAY=1000
 * SINGAPAY_PAYMENT_EXPIRY_DAYS=3
 * SINGAPAY_LOGGING=true
 * SINGAPAY_LOG_CHANNEL=single
 */
