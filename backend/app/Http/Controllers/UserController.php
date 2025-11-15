<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $user]);
    }

    public function update(Request $request, $id)
    {
        // optional: verify ownership
        $authUser = $request->user(); // if you use auth
        // if using localStorage id pattern, client must ensure id matches

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'profile_photo' => ['nullable', 'file', 'image', 'max:2048'], // 2MB
        ]);

        // handle profile photo
        if ($request->hasFile('profile_photo')) {
            // delete old
            if ($user->profile_photo) {
                Storage::disk('public')->delete($user->profile_photo);
            }
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $user->profile_photo = $path;
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // optional: update status only if provided and caller allowed
        if ($request->filled('status')) {
            $user->status = $request->input('status');
        }

        $user->save();

        return response()->json(['status' => 'success', 'data' => $user, 'message' => 'Profil berhasil diperbarui']);
    }

    public function updatePassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['status' => 'error', 'message' => 'Password lama tidak cocok'], 422);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json(['status' => 'success', 'message' => 'Password berhasil diubah']);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        $user = User::findOrFail($id);
        $user->status = $validated['status'];
        $user->save();

        return response()->json(['status' => 'success', 'data' => $user, 'message' => 'Status akun diperbarui']);
    }
}
