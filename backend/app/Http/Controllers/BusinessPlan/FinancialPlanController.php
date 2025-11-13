<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use App\Models\FinancialPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FinancialPlanController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = FinancialPlan::with(['businessBackground', 'user']);

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('business_background_id')) {
                $query->where('business_background_id', $request->business_background_id);
            }

            $data = $query->latest()->get();

            return response()->json([
                'status' => 'success',
                'data' => $data,
                'message' => 'Data rencana keuangan berhasil diambil'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil data rencana keuangan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'business_background_id' => 'required|exists:business_backgrounds,id',
                'capital_source' => 'required|in:Pribadi,Pinjaman,Investor',
                'initial_capex' => 'required|numeric|min:0',
                'monthly_operational_cost' => 'required|numeric|min:0',
                'estimated_monthly_income' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $plan = FinancialPlan::create($validator->validated());

            return response()->json([
                'status' => 'success',
                'data' => $plan->load(['businessBackground', 'user']),
                'message' => 'Rencana keuangan berhasil dibuat'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat rencana keuangan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $plan = FinancialPlan::with(['businessBackground', 'user'])->findOrFail($id);

            return response()->json([
                'status' => 'success',
                'data' => $plan,
                'message' => 'Data rencana keuangan berhasil diambil'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Rencana keuangan tidak ditemukan: ' . $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $plan = FinancialPlan::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'capital_source' => 'sometimes|required|in:Pribadi,Pinjaman,Investor',
                'initial_capex' => 'sometimes|required|numeric|min:0',
                'monthly_operational_cost' => 'sometimes|required|numeric|min:0',
                'estimated_monthly_income' => 'sometimes|required|numeric|min:0',
                'notes' => 'nullable|string|max:500'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $plan->update($validator->validated());

            return response()->json([
                'status' => 'success',
                'data' => $plan->load(['businessBackground', 'user']),
                'message' => 'Rencana keuangan berhasil diperbarui'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui rencana keuangan: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $plan = FinancialPlan::findOrFail($id);
            $plan->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Rencana keuangan berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus rencana keuangan: ' . $e->getMessage()
            ], 500);
        }
    }

    // Method untuk mendapatkan summary keuangan
    public function getFinancialSummary(Request $request)
    {
        try {
            $query = FinancialPlan::with('businessBackground');

            if ($request->has('user_id')) {
                $query->where('user_id', $request->user_id);
            }

            $plans = $query->get();

            $summary = [
                'total_plans' => $plans->count(),
                'total_initial_capex' => $plans->sum('initial_capex'),
                'total_monthly_operational_cost' => $plans->sum('monthly_operational_cost'),
                'total_estimated_monthly_income' => $plans->sum('estimated_monthly_income'),
                'total_profit_loss' => $plans->sum('profit_loss_estimation'),
                'average_profit_margin' => $plans->avg('estimated_monthly_income') > 0 ?
                    ($plans->avg('profit_loss_estimation') / $plans->avg('estimated_monthly_income')) * 100 : 0
            ];

            return response()->json([
                'status' => 'success',
                'data' => $summary,
                'message' => 'Summary keuangan berhasil diambil'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengambil summary keuangan: ' . $e->getMessage()
            ], 500);
        }
    }
}
