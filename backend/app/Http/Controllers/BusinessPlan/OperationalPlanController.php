<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use App\Models\OperationalPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OperationalPlanController extends Controller
{
    public function index(Request $request)
    {
        $query = OperationalPlan::query();

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
        $plan = OperationalPlan::find($id);

        if (!$plan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Operational plan not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $plan
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'nullable|exists:business_backgrounds,id',
            'business_location' => 'required|string|max:255',
            'location_description' => 'nullable|string',
            'location_type' => 'nullable|string|max:50',
            'location_size' => 'nullable|numeric',
            'rent_cost' => 'nullable|numeric',
            'employees' => 'nullable|array',
            'operational_hours' => 'nullable|array',
            'suppliers' => 'nullable|array',
            'daily_workflow' => 'nullable|string',
            'equipment_needs' => 'nullable|string',
            'technology_stack' => 'nullable|string',
            'status' => 'nullable|in:draft,completed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $plan = OperationalPlan::create($request->all());

        return response()->json([
            'status' => 'success',
            'data' => $plan
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $plan = OperationalPlan::find($id);

        if (!$plan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Operational plan not found'
            ], 404);
        }

        if ($request->user_id != $plan->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot update this data'
            ], 403);
        }

        $validated = $request->validate([
            'business_location' => 'sometimes|required|string|max:255',
            'location_description' => 'nullable|string',
            'location_type' => 'nullable|string|max:50',
            'location_size' => 'nullable|numeric',
            'rent_cost' => 'nullable|numeric',
            'employees' => 'nullable|array',
            'operational_hours' => 'nullable|array',
            'suppliers' => 'nullable|array',
            'daily_workflow' => 'nullable|string',
            'equipment_needs' => 'nullable|string',
            'technology_stack' => 'nullable|string',
            'status' => 'nullable|in:draft,active'
        ]);

        $plan->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Operational plan updated successfully',
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $plan = OperationalPlan::find($id);

        if (!$plan) {
            return response()->json([
                'status' => 'error',
                'message' => 'Operational plan not found'
            ], 404);
        }

        if ($request->user_id != $plan->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot delete this data'
            ], 403);
        }

        $plan->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Operational plan deleted successfully'
        ]);
    }
}
