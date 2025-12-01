import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Loader, Plus } from 'lucide-react';
import { forecastDataApi } from '../../services/ManagementFinancial/forecastApi';

const ForecastList = ({ onViewForecast, onCreateNew, onBack }) => {
    const [forecasts, setForecasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        year: '',
        month: '',
    });
    const [pagination, setPagination] = useState({
        current_page: 1,
        total: 0,
    });

    useEffect(() => {
        loadForecasts();
    }, [filters, pagination.current_page]);

    const loadForecasts = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.current_page,
            };

            const response = await forecastDataApi.getList(params);
            setForecasts(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                total: response.data.total,
            });
        } catch (error) {
            console.error('Error loading forecasts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus forecast ini?')) {
            return;
        }

        try {
            await forecastDataApi.delete(id);
            setForecasts(forecasts.filter((f) => f.id !== id));
        } catch (error) {
            console.error('Error deleting forecast:', error);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        setPagination((prev) => ({
            ...prev,
            current_page: 1,
        }));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Daftar Forecast Keuangan
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Kelola semua data forecast dan prediksi keuangan Anda
                    </p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                >
                    <Plus size={20} />
                    Buat Forecast Baru
                </button>
            </div>

            {/* Filter Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tahun
                        </label>
                        <input
                            id="year-filter"
                            type="number"
                            value={filters.year}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                            placeholder="Semua Tahun"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Bulan
                        </label>
                        <select
                            id="month-filter"
                            value={filters.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Semua Bulan</option>
                            <option value="1">Januari</option>
                            <option value="2">Februari</option>
                            <option value="3">Maret</option>
                            <option value="4">April</option>
                            <option value="5">Mei</option>
                            <option value="6">Juni</option>
                            <option value="7">Juli</option>
                            <option value="8">Agustus</option>
                            <option value="9">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ year: '', month: '' })}
                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors duration-200 font-medium"
                        >
                            Reset Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
                        <p className="text-gray-600 dark:text-gray-400">Memuat data forecast...</p>
                    </div>
                ) : forecasts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Belum ada data forecast</p>
                        <button
                            onClick={onCreateNew}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
                        >
                            <Plus size={18} />
                            Buat Forecast Pertama
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Tahun
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Bulan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Pendapatan Penjualan
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Pengeluaran
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Faktor Seasonal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {forecasts.map((forecast) => (
                                    <tr key={forecast.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {forecast.year}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {forecast.month}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            Rp {parseFloat(forecast.income_sales).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            Rp {parseFloat(forecast.expense_operational).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {forecast.seasonal_factor}x
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={() => onViewForecast(forecast)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                                                title="Lihat Detail"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(forecast.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200"
                                                title="Hapus"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {forecasts.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <p>
                        Menampilkan {(pagination.current_page - 1) * 15 + 1} hingga{' '}
                        {Math.min(pagination.current_page * 15, pagination.total)} dari {pagination.total}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ForecastList;
