<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Http;

echo " SINGAPAY CONNECTION DEBUGGER\n";

$mode = config('singapay.mode');
$partnerId = config('singapay.partner_id');
$clientId = config('singapay.client_id');
$clientSecret = config('singapay.client_secret');
$baseUrl = $mode === 'production'
    ? config('singapay.production_url')
    : config('singapay.sandbox_url');

echo "Environment  : " . $mode . "\n";
echo "URL          : " . $baseUrl . "\n";
echo "Partner ID   : " . substr($partnerId, 0, 5) . "..." . substr($partnerId, -5) . "\n";
echo "Client ID    : " . substr($clientId, 0, 5) . "..." . substr($clientId, -5) . "\n";
echo "Client Secret: " . ($clientSecret ? "IS SET ✅" : "NOT SET ❌") . "\n";

if ($mode !== 'sandbox') {
    echo "\n⚠️ WARNING: Mode is NOT sandbox!\n";
}

echo "\n[1/2] Generating Signature...\n";
$timestamp = now()->format('Ymd');
$payload = $clientId . '_' . $clientSecret . '_' . $timestamp;
$signature = hash_hmac('sha512', $payload, $clientSecret);
echo "Timestamp    : " . $timestamp . "\n";
// echo "Payload      : " . $payload . "\n"; // Sensitive
echo "Signature OK ✅\n";

echo "\n[2/2] Requesting Access Token...\n";

try {
    $response = Http::withHeaders([
        'X-PARTNER-ID' => $partnerId,
        'X-CLIENT-ID' => $clientId,
        'X-SIGNATURE' => $signature,
        'Accept' => 'application/json',
        'Content-Type' => 'application/json',
    ])->post($baseUrl . '/api/v1.1/access-token/b2b', [
        'grantType' => 'client_credentials',
    ]);

    echo "Status Code  : " . $response->status() . "\n";

    if ($response->successful()) {
        $data = $response->json();
        $token = $data['data']['access_token'] ?? 'null';
        echo "\n✅ SUCCESS! Token: " . substr($token, 0, 20) . "...\n";
    } else {
        echo "\n❌ FAILED! Server Response:\n";
        echo ">>> " . json_encode($response->json(), JSON_PRETTY_PRINT) . " <<<\n";
    }
} catch (\Exception $e) {
    echo "\n❌ EXCEPTION:\n";
    echo $e->getMessage() . "\n";
}

echo "\n============================================\n";
