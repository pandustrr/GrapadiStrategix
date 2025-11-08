<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\BusinessBackground;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BusinessController extends Controller
{
    // BusinessBackground
    public function index()
    {
        $businesses = BusinessBackground::all();

        return response()->json([
            'status' => 'success',
            'data' => $businesses
        ], 200);
    }

    public function show($id)
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

    public function store(Request $request)
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
            Log::error('Error storing business: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyimpan data.'
            ], 500);
        }
    }

    public function update(Request $request, $id)
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
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'purpose' => 'nullable|string',
            'location' => 'required|string|max:255',
            'business_type' => 'required|string|max:50',
            'start_date' => 'nullable|date',
            'values' => 'nullable|string',
            'vision' => 'nullable|string',
            'mission' => 'nullable|string',
            'contact' => 'nullable|string',
        ]);

        try {
            // Handle logo update
            if ($request->hasFile('logo')) {
                // Upload logo baru
                $path = $request->file('logo')->store('logos', 'public');
                $validated['logo'] = $path;

                // Hapus logo lama jika ada
                if ($business->logo) {
                    Storage::disk('public')->delete($business->logo);
                }
            } elseif ($request->has('logo') && $request->logo === '') {
                // Jika logo dikirim sebagai string kosong, hapus logo
                if ($business->logo) {
                    Storage::disk('public')->delete($business->logo);
                }
                $validated['logo'] = null;
            } else {
                // Jika tidak ada perubahan logo, pertahankan logo lama
                unset($validated['logo']);
            }

            $business->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Business updated successfully',
                'data' => $business
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error updating business: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui data.'
            ], 500);
        }
    }

    public function destroy($id)
    {
        $business = BusinessBackground::find($id);

        if (!$business) {
            return response()->json([
                'status' => 'error',
                'message' => 'Business not found'
            ], 404);
        }

        try {
            // Hapus logo jika ada
            if ($business->logo) {
                Storage::disk('public')->delete($business->logo);
            }

            $business->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Business deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error deleting business: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menghapus data.'
            ], 500);
        }
    }
}
