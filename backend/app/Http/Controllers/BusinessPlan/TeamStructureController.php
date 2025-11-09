<?php

namespace App\Http\Controllers\BusinessPlan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TeamStructure;
use Illuminate\Support\Facades\Validator;

class TeamStructureController extends Controller
{
    public function index()
    {
        $teams = TeamStructure::with('businessBackground', 'user')->get();
        return response()->json(['status' => 'success', 'data' => $teams]);
    }

    public function show($id)
    {
        $team = TeamStructure::with('businessBackground', 'user')->find($id);

        if (!$team) {
            return response()->json(['status' => 'error', 'message' => 'Team structure not found'], 404);
        }

        return response()->json(['status' => 'success', 'data' => $team]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'business_background_id' => 'required|exists:business_backgrounds,id',
            'team_category' => 'nullable|string|max:100',
            'member_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'experience' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable|in:draft,active'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('team_photos', 'public');
        }

        $team = TeamStructure::create([
            'user_id' => $request->user_id,
            'business_background_id' => $request->business_background_id,
            'team_category' => $request->team_category,
            'member_name' => $request->member_name,
            'position' => $request->position,
            'experience' => $request->experience,
            'photo' => $photoPath,
            'status' => $request->status ?? 'draft',
        ]);

        return response()->json(['status' => 'success', 'data' => $team], 201);
    }

    public function update(Request $request, $id)
    {
        $team = TeamStructure::find($id);
        if (!$team) {
            return response()->json(['status' => 'error', 'message' => 'Team not found'], 404);
        }

        $validated = $request->validate([
            'team_category' => 'nullable|string|max:100',
            'member_name' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'experience' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'nullable|in:draft,active'
        ]);

        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('team_photos', 'public');
            $validated['photo'] = $path;
        }

        $team->update($validated);

        return response()->json(['status' => 'success', 'message' => 'Team updated successfully', 'data' => $team]);
    }

    public function destroy($id)
    {
        $team = TeamStructure::find($id);
        if (!$team) {
            return response()->json(['status' => 'error', 'message' => 'Team not found'], 404);
        }

        $team->delete();
        return response()->json(['status' => 'success', 'message' => 'Team deleted successfully']);
    }
}
