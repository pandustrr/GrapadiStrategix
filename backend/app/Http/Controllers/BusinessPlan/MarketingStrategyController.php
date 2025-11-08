<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\MarketingStrategy;

class MarketingStrategyController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'nullable|exists:business_backgrounds,id',
            'promotion_strategy' => 'required|string',
            'media_used' => 'nullable|string',
            'pricing_strategy' => 'nullable|string',
            'monthly_target' => 'nullable|integer|min:0',
            'collaboration_plan' => 'nullable|string',
            'status' => 'nullable|in:draft,active'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $marketing = MarketingStrategy::create($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $marketing
        ], 201);
    }

    public function index(Request $request)
    {
        $query = MarketingStrategy::query();

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->business_background_id) {
            $query->where('business_background_id', $request->business_background_id);
        }

        $data = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function show($id)
    {
        $marketing = MarketingStrategy::find($id);

        if (!$marketing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Marketing strategy not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $marketing
        ]);
    }

    public function update(Request $request, $id)
    {
        $marketing = MarketingStrategy::find($id);

        if (!$marketing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Marketing strategy not found'
            ], 404);
        }

        if ($request->user_id != $marketing->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot update this data'
            ], 403);
        }

        $validated = $request->validate([
            'promotion_strategy' => 'sometimes|required|string',
            'media_used' => 'nullable|string',
            'pricing_strategy' => 'nullable|string',
            'monthly_target' => 'nullable|integer|min:0',
            'collaboration_plan' => 'nullable|string',
            'status' => 'nullable|in:draft,active'
        ]);

        $marketing->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Marketing strategy updated successfully',
            'data' => $marketing
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $marketing = MarketingStrategy::find($id);

        if (!$marketing) {
            return response()->json([
                'status' => 'error',
                'message' => 'Marketing strategy not found'
            ], 404);
        }

        if ($request->user_id != $marketing->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot delete this data'
            ], 403);
        }

        $marketing->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Marketing strategy deleted successfully'
        ]);
    }
}
