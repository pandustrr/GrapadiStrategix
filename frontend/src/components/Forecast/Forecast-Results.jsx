import React, { useState, useEffect } from 'react';
import { Loader, ArrowLeft, TrendingUp, AlertCircle, Trash2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { forecastDataApi } from '../../services/ManagementFinancial/forecastApi';
import ForecastView from './Forecast-View';

const ForecastResults = ({ onBack }) => {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedForecast, setSelectedForecast] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' atau 'detail'
    const [filterYear, setFilterYear] = useState('');
    const [filterMonth, setFilterMonth] = useState('');
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);

    useEffect(() => {
        loadSavedForecasts();
    }, []);

    const loadSavedForecasts = async () => {
        try {
            setLoading(true);
            const response = await forecastDataApi.getList();
            
            // Handle different response formats
            let forecastList = [];
            if (response.data) {
                forecastList = Array.isArray(response.data) ? response.data : (response.data.data || []);
            } else if (Array.isArray(response)) {
                forecastList = response;
            }
            
            // Extract available years and months
            const yearsSet = new Set();
            const monthsSet = new Set();
            
            forecastList.forEach(forecast => {
                if (forecast.year) yearsSet.add(forecast.year);
                if (forecast.month) monthsSet.add(forecast.month);
            });
            
            setAvailableYears(Array.from(yearsSet).sort((a, b) => b - a));
            setAvailableMonths(Array.from(monthsSet).sort((a, b) => a - b));
            
            setForecasts(forecastList.map(forecast => ({
                ...forecast,
                results_with_insights: {
                    results: forecast.forecast_results || [],
                    insights: forecast.insights || [],
                    annual_summary: {
                        total_income: forecast.forecast_results?.reduce((sum, r) => sum + parseFloat(r.forecast_income || 0), 0) || 0,
                        total_expense: forecast.forecast_results?.reduce((sum, r) => sum + parseFloat(r.forecast_expense || 0), 0) || 0,
                        total_profit: forecast.forecast_results?.reduce((sum, r) => sum + parseFloat(r.forecast_profit || 0), 0) || 0,
                        avg_margin: forecast.forecast_results?.length > 0 
                            ? forecast.forecast_results.reduce((sum, r) => sum + parseFloat(r.forecast_margin || 0), 0) / forecast.forecast_results.length
                            : 0,
                        avg_confidence: forecast.forecast_results?.length > 0 
                            ? forecast.forecast_results.reduce((sum, r) => sum + parseFloat(r.confidence_level || 0), 0) / forecast.forecast_results.length
                            : 0,
                    }
                }
            })));
        } catch (error) {
            console.error('Error loading forecasts:', error);
            setForecasts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (forecast) => {
        setSelectedForecast(forecast);
        setViewMode('detail');
    };

    const handleBackToList = () => {
        setViewMode('list');
        setSelectedForecast(null);
    };

    const getMonthName = (monthNumber) => {
        const months = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        return months[monthNumber] || '-';
    };

    const getFilteredForecasts = () => {
        return forecasts.filter(forecast => {
            const yearMatch = !filterYear || forecast.year === parseInt(filterYear);
            const monthMatch = !filterMonth || forecast.month === parseInt(filterMonth);
            return yearMatch && monthMatch;
        });
    };

    if (viewMode === 'detail' && selectedForecast) {
        return (
            <ForecastView
                forecastData={selectedForecast}
                generatedResults={selectedForecast.results_with_insights || {}}
                onBack={handleBackToList}
            />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Hasil & Insights Forecast
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Kelola semua hasil forecast dan insights yang telah disimpan
                    </p>
                </div>
            </div>

            {/* Filter Section */}
            {!loading && forecasts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Filter Grafik</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="filter-year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tahun
                            </label>
                            <select
                                id="filter-year"
                                value={filterYear}
                                onChange={(e) => setFilterYear(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Semua Tahun ({availableYears.length})</option>
                                {availableYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="filter-month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bulan
                            </label>
                            <select
                                id="filter-month"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Semua Bulan ({availableMonths.length})</option>
                                {availableMonths.map((month) => (
                                    <option key={month} value={month}>
                                        {getMonthName(month)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => {
                                    setFilterYear('');
                                    setFilterMonth('');
                                }}
                                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors duration-200 font-medium"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Loading State */}
            {loading && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400">Memuat forecast yang tersimpan...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && forecasts.length === 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Belum ada forecast yang disimpan</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Generate forecast dari menu "Daftar Forecast", lalu klik "Simpan" untuk menyimpan hasil prediksi.
                    </p>
                </div>
            )}

            {/* Forecasts List */}
            {!loading && forecasts.length > 0 && (
                <div className="space-y-6">
                    {getFilteredForecasts().length > 0 ? (
                        getFilteredForecasts().map((forecast, idx) => (
                        <div
                            key={forecast.id || idx}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-6 space-y-6">
                                {/* Header & Quick Stats */}
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {forecast.month ? getMonthName(forecast.month) : 'Tahun'} {forecast.year}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Dibuat: {forecast.created_at ? new Date(forecast.created_at).toLocaleDateString('id-ID') : '-'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleViewDetail(forecast)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200 font-medium text-sm"
                                            >
                                                <TrendingUp size={16} />
                                                Lihat Detail
                                            </button>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-green-600 dark:text-green-400 mb-1">Total Pendapatan</p>
                                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                Rp {forecast.results_with_insights?.annual_summary?.total_income 
                                                    ? parseFloat(forecast.results_with_insights.annual_summary.total_income).toLocaleString('id-ID') 
                                                    : '0'}
                                            </p>
                                        </div>
                                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-red-600 dark:text-red-400 mb-1">Total Pengeluaran</p>
                                            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                                                Rp {forecast.results_with_insights?.annual_summary?.total_expense 
                                                    ? parseFloat(forecast.results_with_insights.annual_summary.total_expense).toLocaleString('id-ID') 
                                                    : '0'}
                                            </p>
                                        </div>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Total Laba</p>
                                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                                Rp {forecast.results_with_insights?.annual_summary?.total_profit 
                                                    ? parseFloat(forecast.results_with_insights.annual_summary.total_profit).toLocaleString('id-ID') 
                                                    : '0'}
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                            <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Rata-rata Margin</p>
                                            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                                {forecast.results_with_insights?.annual_summary?.avg_margin 
                                                    ? parseFloat(forecast.results_with_insights.annual_summary.avg_margin).toFixed(2) 
                                                    : '0'}%
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Charts Section */}
                                {forecast.results_with_insights?.results && forecast.results_with_insights.results.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Grafik Forecast</h4>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            {/* Income Chart */}
                                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Prediksi Pendapatan</h5>
                                                <ResponsiveContainer width="100%" height={180}>
                                                    <LineChart data={forecast.results_with_insights.results}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                                        <YAxis tick={{ fontSize: 11 }} />
                                                        <Tooltip formatter={(value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                                                        <Line type="monotone" dataKey="forecast_income" stroke="#10b981" dot={false} strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Expense Chart */}
                                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Prediksi Pengeluaran</h5>
                                                <ResponsiveContainer width="100%" height={180}>
                                                    <LineChart data={forecast.results_with_insights.results}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                                        <YAxis tick={{ fontSize: 11 }} />
                                                        <Tooltip formatter={(value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                                                        <Line type="monotone" dataKey="forecast_expense" stroke="#ef4444" dot={false} strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Profit Chart */}
                                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Prediksi Laba</h5>
                                                <ResponsiveContainer width="100%" height={180}>
                                                    <BarChart data={forecast.results_with_insights.results}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                                        <YAxis tick={{ fontSize: 11 }} />
                                                        <Tooltip formatter={(value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`} contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                                                        <Bar dataKey="forecast_profit" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Margin Chart */}
                                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                                <h5 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3">Margin Profit (%)</h5>
                                                <ResponsiveContainer width="100%" height={180}>
                                                    <LineChart data={forecast.results_with_insights.results}>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                                        <YAxis tick={{ fontSize: 11 }} />
                                                        <Tooltip formatter={(value) => `${parseFloat(value).toFixed(2)}%`} contentStyle={{ backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px' }} />
                                                        <Line type="monotone" dataKey="forecast_margin" stroke="#8b5cf6" dot={false} strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">Tidak ada forecast yang sesuai dengan filter</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Coba ubah filter tahun atau bulan untuk melihat grafik forecast lainnya.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ForecastResults;
