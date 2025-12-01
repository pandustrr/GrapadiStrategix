# Export PDF Laporan Keuangan - Implementation Guide

## 📋 Overview

Fitur **Export PDF Laporan Keuangan** memungkinkan pengguna untuk mengunduh laporan keuangan komprehensif dalam format PDF landscape. Laporan ini mencakup ringkasan eksekutif, analisis per kategori, tren bulanan, dan proyeksi keuangan 5 tahun dengan 3 skenario.

---

## 🎯 Features

### Core Functionality

1. **Period Selection**

   - Per Tahun (All 12 months)
   - Per Bulan (Specific month)
   - Year range: 2020 - Current Year + 1

2. **Report Content**

   - **Cover Page**: Business info, period, modal awal
   - **Executive Summary**:
     - Total Income/Expense/Net Profit
     - Current Cash Balance
     - Cash Position Breakdown
     - Top Categories
   - **Category Summary**:
     - Top 5 Income Categories
     - Top 5 Expense Categories
   - **Monthly Trend** (Year view only):
     - 12-month comparison
     - Income vs Expense per month
   - **Financial Projections**:
     - 3 Scenarios (Optimistic, Realistic, Pessimistic)
     - Metrics: NPV, ROI, IRR, Payback Period
     - 5-year detailed projection
   - **Charts** (Optional):
     - Income vs Expense comparison
     - Monthly trends
     - Projection comparison

3. **PDF Format**
   - **Orientation**: Landscape A4
   - **Watermark**: "SMARTPLAN" (semi-transparent)
   - **Styling**: Professional gradient design
   - **Font**: Arial, 10px base

---

## 📂 File Structure

```
backend/
├── app/Http/Controllers/ManagementFinancial/
│   └── PdfFinancialReportController.php  (Main controller)
├── resources/views/pdf/
│   └── financial-report.blade.php        (PDF template)
└── routes/
    └── api.php                           (Routes)

frontend/
├── src/components/ManagementFinancial/ExportPDF/
│   └── ExportPDF.jsx                     (UI Component)
├── src/pages/
│   └── ManagementFinancial.jsx           (Integration)
└── src/components/Layout/
    └── Sidebar.jsx                       (Menu)
```

---

## 🔧 Backend Implementation

### Controller: `PdfFinancialReportController.php`

#### Main Methods

1. **`generatePdf(Request $request)`**

   - **Purpose**: Generate and download PDF
   - **Parameters**:
     ```php
     {
       "user_id": 1,
       "business_background_id": 1,
       "period_type": "year|month",
       "period_value": "2025" atau "2025-01",
       "charts": {...}  // optional
     }
     ```
   - **Returns**: PDF file download
   - **Validation**:
     - user_id exists
     - business_background_id exists
     - period_type in ['year', 'month']
     - period_value required

2. **`getFinancialData($userId, $businessBackgroundId, $periodType, $periodValue)`**

   - **Purpose**: Aggregate all financial data
   - **Returns**:
     ```php
     [
       'business_background' => BusinessBackground,
       'categories' => Collection,
       'simulations' => Collection,
       'summary' => Array,
       'category_summary' => Array,
       'monthly_summary' => Array,  // year only
       'projections' => Collection,
       'period' => Array
     ]
     ```

3. **`calculateSummary($simulations, $allSimulations, $businessBackground)`**

   - **Purpose**: Calculate key metrics
   - **Returns**:
     ```php
     [
       'total_income' => float,
       'total_expense' => float,
       'net_profit' => float,
       'transaction_count' => int,
       'income_count' => int,
       'expense_count' => int,
       'current_cash_balance' => float,
       'accumulated_income' => float,
       'accumulated_expense' => float,
       'initial_capital' => float
     ]
     ```

4. **`getCategorySummary($simulations, $categories)`**

   - **Purpose**: Summarize by category
   - **Returns**:
     ```php
     [
       'all' => Array,
       'income' => Array,
       'expense' => Array,
       'top_income' => Array (top 5),
       'top_expense' => Array (top 5)
     ]
     ```

5. **`getMonthlySummary($simulations, $year)`**

   - **Purpose**: Monthly breakdown (year view)
   - **Returns**: Array of 12 months with income/expense/net_profit

6. **`createExecutiveSummary($data)`**
   - **Purpose**: Generate executive insights
   - **Returns**:
     ```php
     [
       'profit_status' => 'profit|loss',
       'profit_percentage' => float,
       'top_income_category' => string,
       'top_expense_category' => string,
       'cash_health' => 'healthy|critical'
     ]
     ```

---

## 🎨 Frontend Implementation

### Component: `ExportPDF.jsx`

#### Key Features

1. **Period Selection**

   ```jsx
   <select value={selectedYear} onChange={...}>
   <select value={selectedMonth} onChange={...}>
   ```

2. **Options**

   ```jsx
   <checkbox checked={includeCharts} onChange={...}>
   ```

3. **Generate Button**
   ```jsx
   onClick = { handleGeneratePDF };
   ```

#### State Management

```jsx
const [loading, setLoading] = useState(false);
const [periodType, setPeriodType] = useState("year");
const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
const [includeCharts, setIncludeCharts] = useState(true);
```

#### API Call

```javascript
const response = await axios.post(
  `${apiUrl}/management-financial/pdf/generate`,
  {
    user_id: userId,
    business_background_id: selectedBusiness.id,
    period_type: periodType,
    period_value: periodValue,
    charts: charts,
  },
  {
    responseType: "blob", // IMPORTANT!
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);
```

#### File Download

```javascript
const blob = new Blob([response.data], { type: "application/pdf" });
const url = window.URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.setAttribute("download", filename);
document.body.appendChild(link);
link.click();
link.remove();
window.URL.revokeObjectURL(url);
```

---

## 🛣️ Routes

### API Routes (`routes/api.php`)

```php
// Financial Report PDF Routes
Route::prefix('pdf')->group(function () {
    Route::post('/generate', [PdfFinancialReportController::class, 'generatePdf']);
    Route::get('/statistics', [PdfFinancialReportController::class, 'getStatistics']);
});
```

**Full Path**: `POST /api/management-financial/pdf/generate`

---

## 📝 Blade Template

### Structure: `financial-report.blade.php`

#### Page Layout

1. **Cover Page**

   - Gradient background (blue to purple)
   - Business name
   - Period label
   - Business type
   - Initial capital
   - Generated timestamp

2. **Executive Summary Page**

   - 4 Summary Cards (Income, Expense, Profit, Cash Balance)
   - Cash Position Table
   - Top Categories

3. **Category Summary Page**

   - Top 5 Income Categories Table
   - Top 5 Expense Categories Table

4. **Monthly Trend Page** (Year view only)

   - 12-month table
   - Chart placeholder

5. **Financial Projections Page**

   - 3 Projection Cards (Optimistic, Realistic, Pessimistic)
   - Chart placeholder
   - Detailed 5-year tables for each scenario

6. **Charts Page** (If charts provided)
   - Income vs Expense chart

#### Styling Highlights

```css
/* Watermark */
.watermark {
  position: fixed;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 100px;
  color: rgba(200, 200, 200, 0.1);
}

/* Cover Page */
.cover-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

/* Summary Cards */
.summary-card {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
}

/* Tables */
table th {
  background: #667eea;
  color: white;
}
```

---

## 🔍 Key Calculations

### 1. Current Cash Balance

```php
$currentCashBalance = $initialCapital + $accumulatedIncome - $accumulatedExpense;
```

### 2. Net Profit

```php
$netProfit = $totalIncome - $totalExpense;
```

### 3. Profit Percentage

```php
$profitPercentage = ($netProfit / $totalIncome) * 100;
```

### 4. Category Percentage

```php
$categoryPercentage = ($categoryTotal / $totalIncome) * 100;
```

---

## 🧪 Testing Checklist

### Backend Tests

- [ ] PDF generates without errors
- [ ] Year filter works correctly
- [ ] Month filter works correctly
- [ ] Summary calculations are accurate
- [ ] Category summary shows top 5
- [ ] Monthly summary shows all 12 months
- [ ] Projections include all 3 scenarios
- [ ] Watermark appears
- [ ] Format is landscape A4

### Frontend Tests

- [ ] Period selection updates correctly
- [ ] Year dropdown shows available years
- [ ] Month dropdown shows all months
- [ ] Charts checkbox toggles
- [ ] Generate button triggers download
- [ ] Loading state displays
- [ ] Error handling works
- [ ] File downloads with correct name
- [ ] Sidebar menu works
- [ ] Navigation to/from component works

### Integration Tests

- [ ] Backend receives correct parameters
- [ ] PDF downloads in browser
- [ ] PDF opens correctly
- [ ] All sections render properly
- [ ] Data matches database
- [ ] Charts display (if included)
- [ ] Watermark visible
- [ ] Footer shows correct info

---

## 🐛 Troubleshooting

### Common Issues

1. **PDF Not Downloading**

   - Check `responseType: "blob"` in axios
   - Verify Authorization header
   - Check backend logs

2. **Blank PDF**

   - Check Blade syntax
   - Verify data is passed to view
   - Check DomPDF configuration

3. **Missing Data**

   - Verify business has simulations
   - Check period has data
   - Confirm projections exist

4. **Style Not Applied**

   - Check `<style>` tag in Blade
   - Verify DomPDF options
   - Use inline styles if needed

5. **500 Error**
   - Check Laravel logs: `storage/logs/laravel.log`
   - Verify all models imported
   - Check database connections

---

## 📊 Sample Request/Response

### Request

```json
POST /api/management-financial/pdf/generate
{
  "user_id": 1,
  "business_background_id": 2,
  "period_type": "year",
  "period_value": "2025",
  "charts": {
    "income_vs_expense": null,
    "monthly_trend": null,
    "projection_comparison": null
  }
}
```

### Response

```
Content-Type: application/pdf
Content-Disposition: attachment; filename="laporan-keuangan-toko-retail-2025-20250112-143022.pdf"

[Binary PDF Data]
```

---

## 🚀 Future Enhancements

### Planned Features

1. **Chart Generation**

   - Backend chart rendering using libraries
   - Chart.js integration for frontend preview
   - Multiple chart types (bar, line, pie)

2. **Custom Templates**

   - Multiple PDF designs
   - User-selectable themes
   - Logo upload

3. **Email Export**

   - Send PDF via email
   - Schedule automatic reports
   - Multi-recipient support

4. **Advanced Filters**

   - Date range selection
   - Category filtering
   - Custom comparison periods

5. **Export Tracking**
   - Log PDF generations
   - Statistics dashboard
   - Download history

---

## 📚 Dependencies

### Backend

- **Laravel**: 11.x
- **DomPDF**: barryvdh/laravel-dompdf
- **Carbon**: Date manipulation

### Frontend

- **React**: 18.x
- **Axios**: HTTP client
- **React Icons**: FiDownload, FiCalendar, etc.
- **React Hot Toast**: Notifications

---

## 👥 Usage Flow

### User Journey

1. User navigates to **Manajemen Keuangan**
2. Selects a business from dropdown
3. Clicks **"Export PDF Laporan Keuangan"** menu
4. Arrives at Export PDF page
5. Selects period type (Year/Month)
6. Selects year (and month if applicable)
7. Toggles charts option
8. Clicks **"Unduh Laporan PDF"**
9. PDF downloads automatically
10. User opens PDF to view comprehensive financial report

### Admin Journey (Future)

1. Admin accesses statistics dashboard
2. Views total PDF exports
3. Sees most exported periods
4. Reviews user download patterns
5. Identifies popular report types

---

## 📖 Documentation Updates

### Added to Sidebar

```jsx
{
  id: "export-pdf-financial",
  label: "Export PDF Laporan Keuangan",
  icon: FileText,
}
```

### Added to ManagementFinancial

```jsx
case "export-pdf-financial":
  return <ExportPDF onBack={handleBackToMain} selectedBusiness={selectedBusiness} />;
```

---

## ✅ Completion Status

### ✅ Completed

- [x] Backend controller implementation
- [x] PDF Blade template
- [x] API routes
- [x] Frontend component
- [x] Sidebar integration
- [x] ManagementFinancial integration
- [x] Period selection (year/month)
- [x] Summary calculations
- [x] Category summary
- [x] Monthly trend (year view)
- [x] Projections integration
- [x] Watermark
- [x] Landscape format
- [x] Error handling
- [x] Loading states
- [x] File download

### ⏳ Pending (Future)

- [ ] Chart generation
- [ ] Multiple templates
- [ ] Email export
- [ ] Export tracking
- [ ] Advanced filters

---

## 🎓 Learning Points

### Key Concepts

1. **Blob Handling**: Using `responseType: "blob"` for binary data
2. **File Download**: Creating temporary URLs for downloads
3. **DomPDF**: Generating PDFs from Blade templates
4. **Landscape PDF**: Using `setPaper('A4', 'landscape')`
5. **Watermark**: Fixed position with rotation
6. **Data Aggregation**: Collecting from multiple sources
7. **Period Filtering**: Dynamic date range handling

---

## 📞 Support

For issues or questions:

- Check Laravel logs: `storage/logs/laravel.log`
- Check browser console for frontend errors
- Verify API endpoints with Postman
- Review this documentation

---

**Created**: January 2025  
**Last Updated**: January 2025  
**Version**: 1.0.0
