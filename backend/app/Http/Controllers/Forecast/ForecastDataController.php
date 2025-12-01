<?php

namespace App\Http\Controllers\Forecast;

use App\Http\Controllers\Controller;
use App\Models\Forecast\ForecastData;
use App\Models\Forecast\ForecastResult;
use App\Models\Forecast\ForecastInsight;
use App\Services\ForecastService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ForecastDataController extends Controller
{
    protected $forecastService;

    public function __construct(ForecastService $forecastService)
    {
        $this->forecastService = $forecastService;
    }

    /**
     * Display a listing of forecast data
     */
    public function index(Request $request)
    {
        $userId = Auth::user()?->id;
        $query = ForecastData::where('user_id', $userId)
            ->with(['forecastResults', 'insights', 'financialSimulation']);

        // Filter by year
        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        // Filter by month
        if ($request->has('month')) {
            $query->where('month', $request->month);
        }

        $forecastData = $query->latest()->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $forecastData,
        ]);
    }

    /**
     * Store a newly created forecast data
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'financial_simulation_id' => 'nullable|exists:financial_simulations,id',
            'month' => 'required|integer|min:1|max:12',
            'year' => 'required|integer|min:2020',
            'income_sales' => 'required|numeric|min:0',
            'income_other' => 'nullable|numeric|min:0',
            'expense_operational' => 'required|numeric|min:0',
            'expense_other' => 'nullable|numeric|min:0',
            'seasonal_factor' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::user()?->id;
        $validated['seasonal_factor'] = $validated['seasonal_factor'] ?? 1.0;
        $validated['income_other'] = $validated['income_other'] ?? 0;
        $validated['expense_other'] = $validated['expense_other'] ?? 0;

        $forecastData = ForecastData::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Forecast data created successfully',
            'data' => $forecastData->load(['forecastResults', 'insights']),
        ], 201);
    }

    /**
     * Display the specified forecast data
     */
    public function show(ForecastData $forecastData)
    {
        // Authorize user
        $userId = Auth::user()?->id;
        if ($forecastData->user_id !== $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $forecastData->load(['forecastResults', 'insights', 'financialSimulation']),
        ]);
    }

    /**
     * Update the specified forecast data
     */
    public function update(Request $request, ForecastData $forecastData)
    {
        // Authorize user
        $userId = Auth::user()?->id;
        if ($forecastData->user_id !== $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validate([
            'month' => 'sometimes|integer|min:1|max:12',
            'year' => 'sometimes|integer|min:2020',
            'income_sales' => 'sometimes|numeric|min:0',
            'income_other' => 'sometimes|numeric|min:0',
            'expense_operational' => 'sometimes|numeric|min:0',
            'expense_other' => 'sometimes|numeric|min:0',
            'seasonal_factor' => 'sometimes|numeric|min:0',
            'notes' => 'sometimes|string',
        ]);

        $forecastData->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Forecast data updated successfully',
            'data' => $forecastData->load(['forecastResults', 'insights']),
        ]);
    }

    /**
     * Delete the specified forecast data
     */
    public function destroy(ForecastData $forecastData)
    {
        // Authorize user
        $userId = Auth::user()?->id;
        if ($forecastData->user_id !== $userId) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        // Delete related results and insights
        ForecastResult::where('forecast_data_id', $forecastData->id)->delete();
        ForecastInsight::where('forecast_data_id', $forecastData->id)->delete();
        $forecastData->delete();

        return response()->json([
            'success' => true,
            'message' => 'Forecast data deleted successfully',
        ]);
    }
}
