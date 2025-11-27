<?php

namespace App\Http\Controllers\ManagementFinancial;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\ManagementFinancial\FinancialSummary;

class MonthlyReportController extends Controller
{
    /**
     * GET /api/management-financial/reports/monthly?year=YYYY
     * Mengembalikan laporan keuangan bulanan (Laba Rugi, Arus Kas, Neraca sederhana, dan Tren)
     */
    public function getMonthlyReport(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:1900|max:3000',
            'business_background_id' => 'nullable|integer',
            'user_id' => 'nullable|integer',
        ]);
        $year = (int) $validated['year'];
        $businessId = $validated['business_background_id'] ?? null;
        $userId = $validated['user_id'] ?? null;

        // Siapkan array 12 bulan
        $months = range(1, 12);

        $incomeStatement = [];
        $cashFlow = [];
        $balanceSheet = [];

        $trends = [
            'revenue' => array_fill(0, 12, 0.0),
            'netIncome' => array_fill(0, 12, 0.0),
            'cashEnding' => array_fill(0, 12, 0.0),
            'totalAssets' => array_fill(0, 12, 0.0),
        ];

        // Ambil summary per bulan dari FinancialSummary
        $query = FinancialSummary::query()->forYear($year);
        if ($businessId) $query->forBusiness($businessId);
        if ($userId) $query->where('user_id', $userId);

        $rows = $query->orderBy('month')->get()->keyBy('month');

        $prevCashEnding = 0.0;
        $cumRetained = 0.0; // akumulasi laba ditahan sederhana

        foreach ($months as $m) {
            $r = $rows[$m] ?? null;

            $revenue = $r->total_income ?? 0.0;
            $opex = $r->total_expense ?? 0.0;
            $grossProfit = $r->gross_profit ?? ($revenue - $opex);
            $netIncome = $r->net_profit ?? ($grossProfit);

            $incomeStatement[$m] = [
                'revenue' => round($revenue, 2),
                'cogs' => 0.0, // tidak tersedia, bisa dipisah di masa depan
                'grossProfit' => round($grossProfit, 2),
                'opex' => round($opex, 2),
                'operatingIncome' => round($grossProfit - 0, 2),
                'otherIncome' => 0.0,
                'interest' => 0.0,
                'tax' => 0.0,
                'netIncome' => round($netIncome, 2),
            ];

            $cashEnding = $r->cash_position ?? ($prevCashEnding + $netIncome);
            $cashBeginning = $prevCashEnding;
            $netChange = $cashEnding - $cashBeginning;
            $operating = $netIncome;
            $investing = 0.0;
            $financing = $netChange - $operating; // agar konsisten

            $cashFlow[$m] = [
                'operating' => round($operating, 2),
                'investing' => round($investing, 2),
                'financing' => round($financing, 2),
                'netChange' => round($netChange, 2),
                'cashBeginning' => round($cashBeginning, 2),
                'cashEnding' => round($cashEnding, 2),
            ];

            $assetsCurrent = $cashEnding; // sederhanakan: kas sebagai aset lancar utama
            $assetsNonCurrent = 0.0;
            $liabCurrent = 0.0; // tidak tersedia
            $liabNonCurrent = 0.0; // tidak tersedia
            $equityPaidIn = 0.0; // tidak tersedia
            $cumRetained += $netIncome;
            $retainedEarnings = $cumRetained;

            $assetsTotal = $assetsCurrent + $assetsNonCurrent;
            $liabilitiesTotal = $liabCurrent + $liabNonCurrent;
            $equityTotal = $equityPaidIn + $retainedEarnings;
            $totalLiabilitiesEquity = $liabilitiesTotal + $equityTotal;

            // Jika neraca tidak seimbang, set equity sebagai balancing figure
            if (abs($assetsTotal - $totalLiabilitiesEquity) > 0.01) {
                $equityTotal = $assetsTotal - $liabilitiesTotal;
                $retainedEarnings = $equityTotal - $equityPaidIn;
                $totalLiabilitiesEquity = $liabilitiesTotal + $equityTotal;
            }

            $balanceSheet[$m] = [
                'assets' => [
                    'current' => round($assetsCurrent, 2),
                    'nonCurrent' => round($assetsNonCurrent, 2),
                    'total' => round($assetsTotal, 2),
                ],
                'liabilities' => [
                    'current' => round($liabCurrent, 2),
                    'nonCurrent' => round($liabNonCurrent, 2),
                    'total' => round($liabilitiesTotal, 2),
                ],
                'equity' => [
                    'paidIn' => round($equityPaidIn, 2),
                    'retainedEarnings' => round($retainedEarnings, 2),
                    'total' => round($equityTotal, 2),
                ],
                'totalLiabilitiesEquity' => round($totalLiabilitiesEquity, 2),
            ];

            $trends['revenue'][$m - 1] = round($revenue, 2);
            $trends['netIncome'][$m - 1] = round($netIncome, 2);
            $trends['cashEnding'][$m - 1] = round($cashEnding, 2);
            $trends['totalAssets'][$m - 1] = round($assetsTotal, 2);

            $prevCashEnding = $cashEnding;
        }

        return response()->json([
            'year' => $year,
            'incomeStatement' => $incomeStatement,
            'cashFlow' => $cashFlow,
            'balanceSheet' => $balanceSheet,
            'trends' => $trends,
        ]);
    }
}
