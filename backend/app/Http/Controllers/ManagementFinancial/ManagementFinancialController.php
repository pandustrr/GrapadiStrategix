<?php

namespace App\Http\Controllers\ManagementFinancial;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ManagementFinancial\FinancialCategory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\ManagementFinancial\FinancialSummary;

class ManagementFinancialController extends Controller
{
    // ===============================
    // FINANCIAL CATEGORY METHODS
    // ===============================

    /**
     * Get all financial categories
     */
    public function indexCategories()
    {
        try {
            $categories = FinancialCategory::all();

            return response()->json([
                'status' => 'success',
                'data' => $categories
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching financial categories: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data kategori.'
            ], 500);
        }
    }

    /**
     * Get specific financial category
     */
    public function showCategory($id)
    {
        try {
            $category = FinancialCategory::find($id);

            if (!$category) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kategori tidak ditemukan'
                ], 404);
            }

            return response()->json([
                'status' => 'success',
                'data' => $category
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching financial category: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil data kategori.'
            ], 500);
        }
    }

    /**
     * Create new financial category
     */
    public function storeCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255|unique:financial_categories,name,NULL,id,user_id,' . $request->user_id,
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|max:7',
            'status' => 'required|in:actual,plan',
            'description' => 'nullable|string'
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique' => 'Nama kategori sudah digunakan.',
            'type.required' => 'Jenis kategori wajib dipilih.',
            'type.in' => 'Jenis kategori harus Income atau Expense.',
            'status.required' => 'Status kategori wajib dipilih.',
            'status.in' => 'Status harus Actual atau Plan.'
        ]);

        if ($validator->fails()) {
            Log::warning('Validasi gagal pada storeFinancialCategory', [
                'errors' => $validator->errors()
            ]);

            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $category = FinancialCategory::create([
                'user_id' => $request->user_id,
                'name' => $request->name,
                'type' => $request->type,
                'color' => $request->color ?? $this->generateDefaultColor($request->type),
                'status' => $request->status,
                'description' => $request->description
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori keuangan berhasil dibuat.',
                'data' => $category
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error storing financial category: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat membuat kategori.'
            ], 500);
        }
    }

    /**
     * Update financial category
     */
    public function updateCategory(Request $request, $id)
    {
        $category = FinancialCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        // Check ownership
        if ($request->user_id != $category->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Anda tidak memiliki akses untuk mengubah data ini.'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:financial_categories,name,' . $id . ',id,user_id,' . $request->user_id,
            'type' => 'required|in:income,expense',
            'color' => 'nullable|string|max:7',
            'status' => 'required|in:actual,plan',
            'description' => 'nullable|string'
        ], [
            'name.required' => 'Nama kategori wajib diisi.',
            'name.unique' => 'Nama kategori sudah digunakan.',
            'type.required' => 'Jenis kategori wajib dipilih.',
            'type.in' => 'Jenis kategori harus Income atau Expense.',
            'status.required' => 'Status kategori wajib dipilih.',
            'status.in' => 'Status harus Actual atau Plan.'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $category->update([
                'name' => $request->name,
                'type' => $request->type,
                'color' => $request->color ?? $category->color,
                'status' => $request->status,
                'description' => $request->description
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori keuangan berhasil diperbarui.',
                'data' => $category
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating financial category: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui kategori.'
            ], 500);
        }
    }

    /**
     * Delete financial category
     */
    public function destroyCategory(Request $request, $id)
    {
        $category = FinancialCategory::find($id);

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kategori tidak ditemukan'
            ], 404);
        }

        // Check ownership
        if ($request->user_id != $category->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Anda tidak memiliki akses untuk menghapus data ini.'
            ], 403);
        }

        try {
            DB::beginTransaction();

            // Check if category has transactions (you can add this later)
            // if ($category->transactions()->exists()) {
            //     return response()->json([
            //         'status' => 'error',
            //         'message' => 'Tidak dapat menghapus kategori yang sudah memiliki transaksi.'
            //     ], 422);
            // }

            $category->delete();

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Kategori keuangan berhasil dihapus.'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting financial category: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghapus kategori.'
            ], 500);
        }
    }

    /**
     * Get categories summary with auto-total
     */
    public function getCategoriesSummary(Request $request)
    {
        try {
            $user_id = $request->user_id;

            $summary = FinancialCategory::where('user_id', $user_id)
                ->selectRaw('
                    type,
                    status,
                    COUNT(*) as total_categories,
                    GROUP_CONCAT(name) as category_names
                ')
                ->groupBy('type', 'status')
                ->get();

            $totalIncomeCategories = FinancialCategory::where('user_id', $user_id)
                ->where('type', 'income')
                ->count();

            $totalExpenseCategories = FinancialCategory::where('user_id', $user_id)
                ->where('type', 'expense')
                ->count();

            return response()->json([
                'status' => 'success',
                'data' => [
                    'summary' => $summary,
                    'totals' => [
                        'income_categories' => $totalIncomeCategories,
                        'expense_categories' => $totalExpenseCategories,
                        'all_categories' => $totalIncomeCategories + $totalExpenseCategories
                    ]
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching categories summary: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengambil ringkasan kategori.'
            ], 500);
        }
    }

    /**
     * Generate default color based on category type
     */
    private function generateDefaultColor($type)
    {
        $colors = [
            'income' => '#10B981', // green-500
            'expense' => '#EF4444' // red-500
        ];

        return $colors[$type] ?? '#6B7280'; // gray-500 as fallback
    }
}
