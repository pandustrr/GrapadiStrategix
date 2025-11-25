import { useState, useEffect } from 'react';
import { 
    Calendar, 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Wallet, 
    Eye, 
    Edit3, 
    Trash2, 
    Plus,
    X,
    BarChart3,
    Target
} from 'lucide-react';
import { toast } from 'react-toastify';
import { managementFinancialApi } from '../../../services/managementFinancial';

const SummaryList = ({
    summaries,
    onView,
    onEdit,
    onDelete,
    onCreateNew,
    selectedYear,
    onYearChange,
    onBack,
    isLoading,
    error,
    onRetry
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [summaryToDelete, setSummaryToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, [selectedYear, summaries]);

    const fetchStatistics = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const params = {
                user_id: user.id,
                year: selectedYear
            };

            const response = await managementFinancialApi.summaries.getStatistics(params);
            if (response.data.status === 'success') {
                setStatistics(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleDeleteClick = (summaryId, summaryPeriod) => {
        setSummaryToDelete({ id: summaryId, period: summaryPeriod });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!summaryToDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(summaryToDelete.id);
            toast.success('Ringkasan keuangan berhasil dihapus!', {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error('Error in SummaryList delete:', error);
            toast.error('Gagal menghapus ringkasan keuangan!', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setSummaryToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setSummaryToDelete(null);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getMonthName = (monthNumber) => {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        return months[monthNumber - 1];
    };

    const calculateProfitMargin = (income, profit) => {
        if (!income || income === 0) return 0;
        return ((profit / income) * 100).toFixed(1);
    };

    // Calculate stats
    const totalIncome = statistics?.total_annual_income || 0;
    const totalExpense = statistics?.total_annual_expense || 0;
    const totalProfit = statistics?.total_annual_net_profit || 0;
    const avgMonthlyIncome = statistics?.avg_monthly_income || 0;
    const totalMonths = statistics?.total_months || 0;

    // Get current month summary
    const currentMonthSummary = summaries.find(summary => 
        summary.month === new Date().getMonth() + 1 && 
        summary.year === selectedYear
    );

    // LOADING STATE
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ringkasan Keuangan Bulanan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola semua ringkasan keuangan bulanan</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Modal Konfirmasi Delete */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Konfirmasi Hapus
                            </h3>
                            <button
                                onClick={handleCancelDelete}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Apakah Anda yakin ingin menghapus ringkasan keuangan ini?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong className="text-gray-900 dark:text-white">"{summaryToDelete?.period}"</strong>
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Hapus
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-3"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                            Ringkasan Keuangan Bulanan
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Kelola semua ringkasan keuangan bulanan - Tahun {selectedYear}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <button
                        onClick={onCreateNew}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        <span>Tambah Ringkasan</span>
                    </button>
                </div>
            </div>

            {/* QUICK STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Total Pendapatan */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pendapatan</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                {formatCurrency(totalIncome)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {selectedYear} • {totalMonths} bulan
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                            <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
                        </div>
                    </div>
                </div>

                {/* Total Pengeluaran */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pengeluaran</p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
                                {formatCurrency(totalExpense)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {selectedYear} • {totalMonths} bulan
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                            <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
                        </div>
                    </div>
                </div>

                {/* Laba Bersih */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Laba Bersih</p>
                            <p className={`text-2xl font-bold mt-1 ${
                                totalProfit >= 0 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                {formatCurrency(totalProfit)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {selectedYear} • {totalMonths} bulan
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                            <DollarSign className="text-blue-600 dark:text-blue-400" size={24} />
                        </div>
                    </div>
                </div>

                {/* Rata-rata Bulanan */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rata-rata/Bulan</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                                {formatCurrency(avgMonthlyIncome)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Pendapatan
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <BarChart3 className="text-purple-600 dark:text-purple-400" size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* CURRENT MONTH HIGHLIGHT */}
            {currentMonthSummary && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                    <Calendar className="text-green-600 dark:text-green-400" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Ringkasan Bulan Ini
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {getMonthName(currentMonthSummary.month)} {currentMonthSummary.year}
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Pendapatan</p>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                        {formatCurrency(currentMonthSummary.total_income)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Pengeluaran</p>
                                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                                        {formatCurrency(currentMonthSummary.total_expense)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Laba</p>
                                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                        {formatCurrency(currentMonthSummary.net_profit)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Kas</p>
                                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                        {formatCurrency(currentMonthSummary.cash_position)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onView(currentMonthSummary)}
                            className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-2 border border-green-200 dark:border-green-700"
                        >
                            <Eye size={16} />
                            Detail
                        </button>
                    </div>
                </div>
            )}

            {/* LIST RINGKASAN */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Daftar Ringkasan Bulanan ({summaries.length} bulan)
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Semua ringkasan keuangan untuk tahun {selectedYear}
                    </p>
                </div>

                {summaries.length === 0 ? (
                    <div className="text-center py-12">
                        <Wallet size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Belum ada data ringkasan
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Mulai dengan menambahkan ringkasan keuangan pertama Anda untuk tahun {selectedYear}
                        </p>
                        <button
                            onClick={onCreateNew}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Tambah Ringkasan Pertama
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Periode
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Pendapatan
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Pengeluaran
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Laba Bersih
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Posisi Kas
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {summaries.map((summary) => (
                                    <tr 
                                        key={summary.id} 
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-150"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {getMonthName(summary.month)} {summary.year}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    Margin: {calculateProfitMargin(summary.total_income, summary.net_profit)}%
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-green-600 dark:text-green-400 font-medium">
                                                {formatCurrency(summary.total_income)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-red-600 dark:text-red-400 font-medium">
                                                {formatCurrency(summary.total_expense)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className={`font-medium ${
                                                summary.net_profit >= 0 
                                                    ? 'text-green-600 dark:text-green-400' 
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}>
                                                {formatCurrency(summary.net_profit)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-blue-600 dark:text-blue-400 font-medium">
                                                {formatCurrency(summary.cash_position)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => onView(summary)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                                    title="Lihat Detail"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => onEdit(summary)}
                                                    className="bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                                    title="Edit"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(summary.id, `${getMonthName(summary.month)} ${summary.year}`)}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* SUMMARY FOOTER */}
            {summaries.length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex flex-col">
                            <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">Total Records</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{summaries.length} bulan</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">Tahun</span>
                            <span className="text-gray-900 dark:text-white font-semibold">{selectedYear}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">Bulan Tercatat</span>
                            <span className="text-gray-900 dark:text-white font-semibold text-xs">
                                {summaries.map(s => s.month).sort((a, b) => a - b).join(', ')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-600 dark:text-gray-400 text-xs font-medium">Status</span>
                            <span className="text-green-600 dark:text-green-400 font-semibold">Aktif</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SummaryList;