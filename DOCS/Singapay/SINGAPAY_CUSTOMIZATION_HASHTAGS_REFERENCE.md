# 🏷️ Singapay B2B Payment Gateway - Customization Hashtags Reference

**Complete list of all customization markers in the codebase**

---

## 🔐 Critical Credentials (MUST REPLACE)

### 1. `#SINGAPAY_PARTNER_ID#`
**Where**: 
- `config/singapay.php` (line ~30)
- `backend/.env.singapay.example`
- `SingapayPDFExportService.php` (line ~40)

**What to Replace With**: 
- Partner ID from Singapay B2B dashboard
- Format: Numeric ID (e.g., 123456789)
- Example: `SINGAPAY_PARTNER_ID=123456789`

**Importance**: 🔴 CRITICAL - Required for all API calls

---

### 2. `#SINGAPAY_CLIENT_ID#`
**Where**:
- `config/singapay.php` (line ~40)
- `backend/.env.singapay.example`
- `SingapayPDFExportService.php` (line ~50)

**What to Replace With**:
- OAuth 2.0 Client ID from Singapay
- Used for token authentication
- Example: `SINGAPAY_CLIENT_ID=client_abc123xyz`

**Importance**: 🔴 CRITICAL - Required for authentication

---

### 3. `#SINGAPAY_CLIENT_SECRET#`
**Where**:
- `config/singapay.php` (line ~50)
- `backend/.env.singapay.example`
- `SingapayPDFExportService.php` (line ~60)

**What to Replace With**:
- OAuth 2.0 Client Secret from Singapay
- DO NOT hardcode! Use environment variable only
- Example: `SINGAPAY_CLIENT_SECRET=secret_xyz789abc`

**Importance**: 🔴 CRITICAL - Never expose! Use .env only

**Security Note**: ⚠️ If exposed, regenerate immediately at Singapay dashboard

---

### 4. `#SINGAPAY_SANDBOX_URL#`
**Where**:
- `config/singapay.php` (line ~60)
- `backend/.env.singapay.example`
- `SingapayPDFExportService.php` (line ~70)

**What to Replace With**:
- Sandbox API base URL from Singapay
- Default: `https://sandbox-payment-b2b.singapay.id`
- May differ if Singapay provides alternate sandbox
- Example: `SINGAPAY_SANDBOX_URL=https://sandbox-payment-b2b.singapay.id`

**Importance**: 🟡 IMPORTANT - For testing environment

---

### 5. `#SINGAPAY_PRODUCTION_URL#`
**Where**:
- `config/singapay.php` (line ~70)
- `backend/.env.singapay.example`
- `SingapayPDFExportService.php` (line ~80)

**What to Replace With**:
- Production API base URL from Singapay
- Default: `https://payment-b2b.singapay.id`
- May differ if Singapay provides alternate
- Example: `SINGAPAY_PRODUCTION_URL=https://payment-b2b.singapay.id`

**Importance**: 🔴 CRITICAL - For live payments

---

### 6. `#SINGAPAY_WEBHOOK_SECRET#`
**Where**:
- `config/singapay.php` (line ~80)
- `backend/.env.singapay.example`
- `SingapayWebhookController.php` (line ~60)

**What to Replace With**:
- Webhook signature validation secret from Singapay
- Used to verify webhook authenticity
- Example: `SINGAPAY_WEBHOOK_SECRET=webhook_secret_abc123`

**Importance**: 🔴 CRITICAL - Security of webhook processing

**Security Note**: ⚠️ Must match exactly what's registered in Singapay dashboard

---

## 🎯 Customization Points (Code Comments)

### Payment Configuration

#### 7. `[CUSTOMIZATION_VA]`
**Location**: `PDFExportProController.php` line ~120

**Purpose**: Customize bank selection for Virtual Account generation

**Current Default**: BRI
```php
$vaResult = $this->singapayService->createVirtualAccount(
    $singapayAccountId,
    $amount,
    'BRI', // <- [CUSTOMIZATION_VA] Change bank here
    false,
    null
);
```

**Available Options**: BRI, BCA, MANDIRI, BTN

**How to Customize**:
- Change 'BRI' to preferred bank
- Or make dynamic based on user selection
- Verify bank is enabled in your Singapay merchant account

---

#### 8. `[CUSTOMIZATION_PRICING]`
**Location**: 
- `PDFExportProController.php` line ~105
- `config/singapay.php` line ~130

**Purpose**: Customize package pricing

**Current Pricing**:
```php
$pricing = [
    'professional' => 50000,  // Rp 50.000
    'business' => 100000,      // Rp 100.000
];
```

**How to Customize**:
- Adjust amounts as needed
- Update both controller AND config file
- Remember amounts are in IDR (Rupiah)
- Update frontend accordingly

---

#### 9. `[CUSTOMIZATION_SINGAPAY_ACCOUNT]`
**Location**: `PDFExportProController.php` line ~110

**Purpose**: Customize Merchant Account ID for VA generation

**Current Default**: 
```php
$singapayAccountId = config('services.singapay.merchant_account_id', 'default_account');
```

**How to Customize**:
- Set in `config/singapay.php`
- Or set in .env: `SINGAPAY_MERCHANT_ACCOUNT_ID=your_account_id`
- Get actual ID from Singapay dashboard
- Required for Virtual Account generation

---

### Payment Method Configuration

#### 10. `[CUSTOMIZATION_QRIS]`
**Location**: `PDFExportProController.php` line ~180

**Purpose**: Customize QRIS code generation

**Code Section**:
```php
if ($request->payment_method === 'qris') {
    // [CUSTOMIZATION_QRIS] - Generate QRIS code
    $result = $this->singapayService->generateQRIS(
        $exportRequest->amount,
        "PDF Export - {$exportRequest->export_type}"
    );
```

**How to Customize**:
- Adjust description format
- Change parameters based on needs
- Reference SingapayPDFExportService.php for full options

---

#### 11. `[CUSTOMIZATION_LINK]`
**Location**: `PDFExportProController.php` line ~200

**Purpose**: Customize Payment Link generation

**Code Section**:
```php
elseif ($request->payment_method === 'payment_link') {
    // [CUSTOMIZATION_LINK] - Generate payment link
    $result = $this->singapayService->generatePaymentLink(
        $exportRequest->amount,
        "export-{$exportRequest->id}",
        Auth::user()->email,
        "PDF Export - {$exportRequest->export_type}"
    );
```

**How to Customize**:
- Change reference ID format
- Customize description
- Add additional parameters if needed

---

### Webhook Configuration

#### 12. `[CUSTOMIZATION_WEBHOOK_SECRET]`
**Location**: `SingapayWebhookController.php` line ~55

**Purpose**: Webhook signature validation configuration

**Code Section**:
```php
$webhookSecret = config('services.singapay.webhook_secret', '#SINGAPAY_WEBHOOK_SECRET#');
```

**How to Customize**:
- Already references config/singapay.php
- Ensure .env has correct `SINGAPAY_WEBHOOK_SECRET`
- Must match Singapay dashboard webhook secret exactly

---

#### 13. `[CUSTOMIZATION_WEBHOOK_STATUS]`
**Location**: `SingapayWebhookController.php` line ~210

**Purpose**: Map Singapay payment statuses to internal statuses

**Current Mapping**:
```php
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
```

**How to Customize**:
- Update with actual Singapay status values
- Add new statuses if needed
- Ensure all Singapay statuses are mapped

---

#### 14. `[CUSTOMIZATION_SIGNATURE_VALIDATION]`
**Location**: `SingapayWebhookController.php` line ~120

**Purpose**: Webhook signature validation method

**Current Implementation**:
```php
protected function validateWebhookSignature(Request $request, $webhookSecret)
{
    $signature = $request->header('X-Singapay-Signature');
    if (!$signature) return false;
    
    $body = $request->getContent();
    $expectedSignature = hash_hmac('sha256', $body, $webhookSecret);
    
    return hash_equals($expectedSignature, $signature);
}
```

**How to Customize**:
- If Singapay uses different header name, update `X-Singapay-Signature`
- If different algorithm, update hash_hmac from 'sha256'
- Verify with Singapay webhook documentation

---

### Post-Payment Processing

#### 15. `[CUSTOMIZATION_PDF_GENERATION]`
**Location**: `SingapayWebhookController.php` line ~185

**Purpose**: Automatically generate PDF after payment

**Current State**: Commented out
```php
// [CUSTOMIZATION_PDF_GENERATION] - Uncomment untuk auto-generate PDF
// dispatch(new GeneratePDFExportJob($exportRequest->id));
```

**How to Customize**:
- Uncomment when ready to auto-generate
- Create `GeneratePDFExportJob` queue job
- Or call PDF generation directly
- Test thoroughly before uncommenting

---

#### 16. `[CUSTOMIZATION_EMAIL]`
**Location**: 
- `SingapayWebhookController.php` line ~200 (confirmations)
- `SingapayWebhookController.php` line ~228 (failures)

**Purpose**: Send email notifications for payments

**Current State**: Commented out
```php
// [CUSTOMIZATION_EMAIL] - Implement email notification
// Mail::send(new PaymentConfirmationMail($exportRequest));
```

**How to Customize**:
- Create Mail classes:
  - `PaymentConfirmationMail`
  - `PaymentFailedMail`
- Uncomment when ready
- Update email addresses/templates

---

### Manual Status Checking

#### 17. `[CUSTOMIZATION_POLLING]`
**Location**: `SingapayWebhookController.php` line ~260

**Purpose**: Manual payment status polling from Singapay API

**Current State**: Commented out
```php
// [CUSTOMIZATION_POLLING] - Implement API polling
if ($exportRequest->singapay_reference_id) {
    // Query Singapay API untuk update status
    // $status = $this->singapayService->checkPaymentStatus($exportRequest->singapay_reference_id);
}
```

**How to Customize**:
- Implement if webhook unreliable
- Call SingapayService checkPaymentStatus method
- Add to payment status manual check endpoint
- Add frontend polling logic

---

## 📝 Replacement Workflow

### Step 1: Collect All Credentials
```
From Singapay B2B Dashboard:
□ Partner ID = ________________
□ Client ID = ________________
□ Client Secret = ________________
□ Webhook Secret = ________________
□ Merchant Account ID = ________________
□ Sandbox URL = ________________ (if different)
□ Production URL = ________________ (if different)
```

### Step 2: Update .env File
```bash
# File: backend/.env

SINGAPAY_ENV=sandbox  # Change to production when ready

# Replace hashtags with collected credentials
SINGAPAY_PARTNER_ID=your_partner_id_here
SINGAPAY_CLIENT_ID=your_client_id_here
SINGAPAY_CLIENT_SECRET=your_client_secret_here
SINGAPAY_WEBHOOK_SECRET=your_webhook_secret_here
SINGAPAY_MERCHANT_ACCOUNT_ID=your_account_id_here
SINGAPAY_WEBHOOK_URL=https://yourdomain.com/api/webhooks/singapay/payment-settlement
```

### Step 3: Verify Configuration
```bash
php artisan tinker
> config('services.singapay')  # Check all values loaded
```

### Step 4: Test Each Credential
```bash
# Test API connectivity
curl -X POST https://sandbox-payment-b2b.singapay.id/api/v1.1/access-token \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET"
  }'
```

---

## 🔍 Quick Find Guide

### Find All Hashtags
```bash
# Search entire backend directory
grep -r "#SINGAPAY_" backend/

# Search specific file
grep "#SINGAPAY_" config/singapay.php
grep "#SINGAPAY_" backend/.env.singapay.example
```

### Find All Customization Points
```bash
# Find all customization markers
grep -r "\[CUSTOMIZATION_" backend/

# Find specific customization
grep -r "CUSTOMIZATION_PRICING" backend/
grep -r "CUSTOMIZATION_WEBHOOK" backend/
```

---

## ✅ Replacement Checklist

Before deploying:
- [ ] All 6 hashtag credentials replaced
- [ ] .env file updated
- [ ] Database migrations run
- [ ] Routes registered
- [ ] Webhook registered in Singapay
- [ ] Tested in sandbox environment
- [ ] Email notifications implemented (optional)
- [ ] PDF auto-generation implemented (optional)
- [ ] Payment polling implemented (optional)
- [ ] Verified configuration loads correctly
- [ ] Tested all API endpoints
- [ ] Webhook signature validation verified

---

## 🎓 Examples

### Example 1: Replace in .env
```env
# Before
SINGAPAY_PARTNER_ID=#SINGAPAY_PARTNER_ID#
SINGAPAY_CLIENT_ID=#SINGAPAY_CLIENT_ID#

# After (Example values)
SINGAPAY_PARTNER_ID=123456789
SINGAPAY_CLIENT_ID=client_abc123xyz789
```

### Example 2: Bank Customization
```php
// Before
'BRI', // <- [CUSTOMIZATION_VA] Change bank here

// After
$userBank = $request->input('preferred_bank', 'BRI');
// Verify bank is allowed
$allowedBanks = ['BRI', 'BCA', 'MANDIRI', 'BTN'];
if (!in_array($userBank, $allowedBanks)) {
    $userBank = 'BRI';
}
```

### Example 3: Pricing Customization
```php
// Before
$pricing = [
    'professional' => 50000,
    'business' => 100000,
];

// After
$pricing = [
    'professional' => 75000,  // Updated to Rp 75.000
    'business' => 150000,     // Updated to Rp 150.000
];
```

---

## 🛡️ Security Reminders

### DO NOT
- ❌ Hardcode credentials in code
- ❌ Commit .env file to version control
- ❌ Share webhook secret publicly
- ❌ Expose client secret in logs
- ❌ Use same secret for sandbox and production

### DO
- ✅ Use environment variables for all secrets
- ✅ Use .env.example without actual values
- ✅ Regenerate secrets if exposed
- ✅ Rotate secrets periodically
- ✅ Use different credentials for sandbox/production
- ✅ Monitor for suspicious patterns
- ✅ Enable HTTPS for all endpoints

---

## 📞 Support

- **Questions about hashtags**: Refer to this file
- **Singapay API issues**: Check SINGAPAY_PDF_EXPORT_PRO_ROUTES.md
- **Implementation issues**: Check SINGAPAY_PDF_EXPORT_IMPLEMENTATION_CHECKLIST.md
- **Quick reference**: Check SINGAPAY_PDF_EXPORT_QUICK_START.md

---

**Last Updated**: January 2024  
**Total Customization Points**: 17 (6 hashtags + 11 code comments)  
**Status**: Ready for credential replacement ✅

Keep this file handy during implementation!
