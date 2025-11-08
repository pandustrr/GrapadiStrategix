<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ProductService;


class ProductServiceController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'nullable|exists:business_backgrounds,id',
            'type' => 'nullable|in:product,service',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'nullable|numeric|min:0',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'advantages' => 'nullable|string',
            'development_strategy' => 'nullable|string',
            'status' => 'nullable|in:draft,in_development,launched'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image_path')) {
            $imagePath = $request->file('image_path')->store('product_images', 'public');
        }

        $product = ProductService::create([
            'user_id' => $request->user_id,
            'business_background_id' => $request->business_background_id,
            'type' => $request->type ?? 'product',
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'image_path' => $imagePath,
            'advantages' => $request->advantages,
            'development_strategy' => $request->development_strategy,
            'status' => $request->status ?? 'draft',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $product
        ], 201);
    }

    public function index(Request $request)
    {
        $query = ProductService::query();

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
        $product = ProductService::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product or service not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $product
        ]);
    }

    public function update(Request $request, $id)
    {
        $product = ProductService::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product or service not found'
            ], 404);
        }

        if ($request->user_id != $product->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot update this data'
            ], 403);
        }

        $validated = $request->validate([
            'type' => 'nullable|in:product,service',
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'nullable|numeric|min:0',
            'image_path' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'advantages' => 'nullable|string',
            'development_strategy' => 'nullable|string',
            'status' => 'nullable|in:draft,in_development,launched'
        ]);

        if ($request->hasFile('image_path')) {
            $validated['image_path'] = $request->file('image_path')->store('product_images', 'public');
        }

        $product->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Product/service updated successfully',
            'data' => $product
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $product = ProductService::find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product or service not found'
            ], 404);
        }

        if ($request->user_id != $product->user_id) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: You cannot delete this data'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product/service deleted successfully'
        ]);
    }
}
