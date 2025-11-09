<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProductService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class ProductServiceController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'type' => 'required|in:product,service',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'advantages' => 'nullable|string',
            'development_strategy' => 'nullable|string',
            'status' => 'nullable|in:draft,in_development,launched'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $imagePath = null;
            if ($request->hasFile('image_path')) {
                $imagePath = $request->file('image_path')->store('product_images', 'public');

                Log::info('Image uploaded successfully', [
                    'original_name' => $request->file('image_path')->getClientOriginalName(),
                    'stored_path' => $imagePath,
                    'full_url' => asset('storage/' . $imagePath) // TAMBAHKAN INI
                ]);
            }

            $product = ProductService::create([
                'user_id' => $request->user_id,
                'business_background_id' => $request->business_background_id,
                'type' => $request->type,
                'name' => $request->name,
                'description' => $request->description,
                'price' => $request->price,
                'image_path' => $imagePath,
                'advantages' => $request->advantages,
                'development_strategy' => $request->development_strategy,
                'status' => $request->status ?? 'draft',
            ]);

            // Load relationships
            $product->load(['businessBackground', 'user']);

            // TAMBAHKAN: Format response dengan full image URL
            $formattedProduct = $this->formatProductResponse($product);

            return response()->json([
                'status' => 'success',
                'message' => 'Product/service created successfully',
                'data' => $formattedProduct
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error creating product/service: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $query = ProductService::with(['businessBackground', 'user']);

            if ($request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->business_background_id) {
                $query->where('business_background_id', $request->business_background_id);
            }

            $data = $query->orderBy('created_at', 'desc')->get();

            // TAMBAHKAN: Format semua produk dengan full image URL
            $formattedData = $data->map(function ($product) {
                return $this->formatProductResponse($product);
            });

            return response()->json([
                'status' => 'success',
                'data' => $formattedData
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching products/services: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch products/services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $product = ProductService::with(['businessBackground', 'user'])->find($id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product or service not found'
                ], 404);
            }

            // TAMBAHKAN: Format response dengan full image URL
            $formattedProduct = $this->formatProductResponse($product);

            return response()->json([
                'status' => 'success',
                'data' => $formattedProduct
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching product/service: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $product = ProductService::find($id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product or service not found'
                ], 404);
            }

            // Check ownership
            if ($request->user_id != $product->user_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: You cannot update this data'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'business_background_id' => 'required|exists:business_backgrounds,id',
                'type' => 'required|in:product,service',
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'nullable|numeric|min:0',
                'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'advantages' => 'nullable|string',
                'development_strategy' => 'nullable|string',
                'status' => 'nullable|in:draft,in_development,launched'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [
                'business_background_id' => $request->business_background_id,
                'type' => $request->type,
                'name' => $request->name,
                'description' => $request->description,
                'advantages' => $request->advantages,
                'development_strategy' => $request->development_strategy,
                'status' => $request->status ?? 'draft',
            ];

            // Handle price
            if ($request->has('price') && $request->price !== '') {
                $updateData['price'] = $request->price;
            } else {
                $updateData['price'] = null;
            }

            // Handle image upload
            if ($request->hasFile('image_path')) {
                // Delete old image if exists
                if ($product->image_path) {
                    Storage::disk('public')->delete($product->image_path);
                }

                // Simpan file baru
                $updateData['image_path'] = $request->file('image_path')->store('product_images', 'public');

                Log::info('Image updated successfully', [
                    'new_path' => $updateData['image_path'],
                    'full_url' => asset('storage/' . $updateData['image_path']) // TAMBAHKAN INI
                ]);
            }

            $product->update($updateData);

            // Reload dengan relationship
            $product->load(['businessBackground', 'user']);

            // TAMBAHKAN: Format response dengan full image URL
            $formattedProduct = $this->formatProductResponse($product);

            return response()->json([
                'status' => 'success',
                'message' => 'Product/service updated successfully',
                'data' => $formattedProduct
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating product/service: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $product = ProductService::find($id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product or service not found'
                ], 404);
            }

            // Check ownership
            if ($request->user_id != $product->user_id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized: You cannot delete this data'
                ], 403);
            }

            // Delete image if exists
            if ($product->image_path) {
                Storage::disk('public')->delete($product->image_path);
            }

            $product->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Product/service deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting product/service: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete product/service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Format product response dengan full image URL
     */
    private function formatProductResponse($product)
    {
        $formatted = $product->toArray();

        // Tambahkan full image URL jika ada image_path
        if ($product->image_path) {
            $formatted['image_url'] = asset('storage/' . $product->image_path);
        } else {
            $formatted['image_url'] = null;
        }

        return $formatted;
    }
}
