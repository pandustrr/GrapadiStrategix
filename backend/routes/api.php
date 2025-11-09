<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusinessPlan\BusinessController;
use App\Http\Controllers\BusinessPlan\MarketAnalysisController;
use App\Http\Controllers\BusinessPlan\MarketingStrategyController;
use App\Http\Controllers\BusinessPlan\ProductServiceController;
use App\Http\Controllers\BusinessPlan\OperationalPlanController;
use App\Http\Controllers\BusinessPlan\TeamStructureController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
Route::post('/resend-verification', [AuthController::class, 'resendVerificationEmail']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

// Operational Plan Routes
Route::middleware('auth:sanctum')->group(function () {
    // Route::apiResource('operational-plans', OperationalPlanController::class);
    Route::get('business-backgrounds', [BusinessController::class, 'index']);
});


// Business Background
Route::prefix('business-background')->group(function () {
    Route::post('/', [BusinessController::class, 'store']);     // Create
    Route::get('/', [BusinessController::class, 'index']);      // Read all
    Route::get('/{id}', [BusinessController::class, 'show']);   // Read single
    Route::put('/{id}', [BusinessController::class, 'update']); // Update
    Route::delete('/{id}', [BusinessController::class, 'destroy']); // Delete
});

// Market Analysis
Route::prefix('market-analysis')->group(function () {
    Route::get('/', [MarketAnalysisController::class, 'index']); // optional: ?user_id=1 or ?business_background_id=2
    Route::get('/{id}', [MarketAnalysisController::class, 'show']);
    Route::post('/', [MarketAnalysisController::class, 'store']);
    Route::put('/{id}', [MarketAnalysisController::class, 'update']);
    Route::delete('/{id}', [MarketAnalysisController::class, 'destroy']);
});

// Product Service Routes
Route::prefix('product-service')->group(function () {
    Route::get('/', [ProductServiceController::class, 'index']);
    Route::get('/{id}', [ProductServiceController::class, 'show']);
    Route::post('/', [ProductServiceController::class, 'store']);
    Route::post('/{id}', [ProductServiceController::class, 'update']); // POST untuk FormData
    Route::put('/{id}', [ProductServiceController::class, 'update']); // PUT untuk JSON
    Route::delete('/{id}', [ProductServiceController::class, 'destroy']);
});

// Marketing Strategy
Route::prefix('marketing-strategy')->group(function () {
    Route::get('/', [MarketingStrategyController::class, 'index']);
    Route::post('/', [MarketingStrategyController::class, 'store']);
    Route::get('/{id}', [MarketingStrategyController::class, 'show']);
    Route::put('/{id}', [MarketingStrategyController::class, 'update']);
    Route::delete('/{id}', [MarketingStrategyController::class, 'destroy']);
});

// Operational Plan
Route::prefix('operational-plan')->group(function () {
    Route::get('/', [OperationalPlanController::class, 'index']);
    Route::post('/', [OperationalPlanController::class, 'store']);
    Route::get('/{id}', [OperationalPlanController::class, 'show']);
    Route::put('/{id}', [OperationalPlanController::class, 'update']);
    Route::delete('/{id}', [OperationalPlanController::class, 'destroy']);
});

Route::prefix('team-structure')->group(function () {
    Route::get('/', [TeamStructureController::class, 'index']);
    Route::get('/{id}', [TeamStructureController::class, 'show']);
    Route::post('/', [TeamStructureController::class, 'store']);
    Route::put('/{id}', [TeamStructureController::class, 'update']);
    Route::delete('/{id}', [TeamStructureController::class, 'destroy']);
});

// Route::get('/test-email/{email?}', function ($email = null) {
//     $testEmail = $email ?: 'pandusatria2807@gmail.com';

//     try {
//         Mail::raw('Test email from PlanWeb - Email Verification System', function ($message) use ($testEmail) {
//             $message->to($testEmail)
//                 ->subject('Test Email Verification - PlanWeb');
//         });

//         return response()->json([
//             'success' => true,
//             'message' => 'Email sent successfully to: ' . $testEmail
//         ]);
//     } catch (\Exception $e) {
//         return response()->json([
//             'success' => false,
//             'message' => $e->getMessage()
//         ]);
//     }
// });
