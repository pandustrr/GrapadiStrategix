<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\BusinessBackground;
use App\Models\MarketAnalysis;
use Illuminate\Support\Facades\Log;

class BusinessController extends Controller
{
    // BusinessBackground
    public function indexBusinessBackground()
    {
        $businesses = BusinessBackground::all();

        return response()->json([
            'status' => 'success',
            'data' => $businesses
        ], 200);
    }

    public function showBusinessBackground($id)
    {
        $business = BusinessBackground::find($id);

        if (!$business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Business not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $business
        ], 200);
    }

    public function storeBusinessBackground(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'description' => 'required|string',
            'purpose' => 'nullable|string',
            'location' => 'nullable|string|max:255',
            'business_type' => 'nullable|string|max:50',
            'start_date' => 'nullable|date',
            'values' => 'nullable|string',
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'contact' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            Log::warning('Validasi gagal pada storeBusinessBackground', [
                'errors' => $validator->errors()
            ]);

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {

            $logoPath = null;
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('logos', 'public');
            }

            // Simpan data ke database
            $business = BusinessBackground::create([
                'user_id' => $request->user_id,
                'logo' => $logoPath,
                'name' => $request->name,
                'category' => $request->category,
                'description' => $request->description,
                'purpose' => $request->purpose,
                'location' => $request->location,
                'business_type' => $request->business_type,
                'start_date' => $request->start_date,
                'values' => $request->values,
                'vision' => $request->vision,
                'mission' => $request->mission,
                'contact' => $request->contact,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Data latar belakang usaha berhasil disimpan.',
                'data' => $business
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data.'
            ], 500);
        }
    }

    public function updateBusinessBackground(Request $request, $id)
    {
        $business = BusinessBackground::find($id);

        if (!$business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Business not found'
            ], 404);
        }

        // Cek apakah user_id cocok dengan pemilik data
        if ($request->user_id != $business->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot update this data'
            ], 403);
        }

        $validated = $request->validate([
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'purpose' => 'sometimes|required|string',
            'location' => 'sometimes|required|string|max:255',
            'business_type' => 'sometimes|required|string|max:50',
            'start_date' => 'sometimes|required|date',
            'values' => 'nullable|string',
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'contact' => 'nullable|string',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            $validated['logo'] = $path;
        }

        $business->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Business updated successfully',
            'data' => $business
        ], 200);
    }

    public function destroyBusinessBackground($id)
    {
        $business = BusinessBackground::find($id);

        if (!$business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Business not found'
            ], 404);
        }

        $business->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Business deleted successfully'
        ], 200);
    }

    // MarketAnalysis
    public function indexMarketAnalysis(Request $request)
    {
        $query = MarketAnalysis::query();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('business_background_id')) {
            $query->where('business_background_id', $request->business_background_id);
        }

        $analyses = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $analyses
        ], 200);
    }

    // SHOW
    public function showMarketAnalysis($id)
    {
        $analysis = MarketAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Market analysis not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $analysis
        ], 200);
    }

    // STORE
    public function storeMarketAnalysis(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'nullable|exists:business_backgrounds,id',
            'target_market' => 'nullable|string',
            'market_size' => 'nullable|string|max:255',
            'market_trends' => 'nullable|string',
            'main_competitors' => 'nullable|string',
            'competitor_strengths' => 'nullable|string',
            'competitor_weaknesses' => 'nullable|string',
            'competitive_advantage' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $analysis = MarketAnalysis::create([
            'user_id' => $request->user_id,
            'business_background_id' => $request->business_background_id,
            'target_market' => $request->target_market,
            'market_size' => $request->market_size,
            'market_trends' => $request->market_trends,
            'main_competitors' => $request->main_competitors,
            'competitor_strengths' => $request->competitor_strengths,
            'competitor_weaknesses' => $request->competitor_weaknesses,
            'competitive_advantage' => $request->competitive_advantage,
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $analysis
        ], 201);
    }

    // UPDATE (cek ownership via user_id yang dikirim)
    public function updateMarketAnalysis(Request $request, $id)
    {
        $analysis = MarketAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Market analysis not found'
            ], 404);
        }

        // Pastikan user yang mengupdate sesuai dengan owner (user_id dikirim dari frontend)
        if (!$request->has('user_id') || $request->user_id != $analysis->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: user_id missing or does not match owner'
            ], 403);
        }

        $validated = $request->validate([
            'target_market' => 'nullable|string',
            'market_size' => 'nullable|string|max:255',
            'market_trends' => 'nullable|string',
            'main_competitors' => 'nullable|string',
            'competitor_strengths' => 'nullable|string',
            'competitor_weaknesses' => 'nullable|string',
            'competitive_advantage' => 'nullable|string',
        ]);

        $analysis->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Market analysis updated successfully',
            'data' => $analysis
        ], 200);
    }

    // DESTROY (cek ownership)
    public function destroyMarketAnalysis(Request $request, $id)
    {
        $analysis = MarketAnalysis::find($id);

        if (!$analysis) {
            return response()->json([
                'status' => 'error',
                'message' => 'Market analysis not found'
            ], 404);
        }

        if (!$request->has('user_id') || $request->user_id != $analysis->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: user_id missing or does not match owner'
            ], 403);
        }

        $analysis->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Market analysis deleted successfully'
        ], 200);
    }
}
