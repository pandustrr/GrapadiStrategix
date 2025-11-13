import { DollarSign, Building, Calendar, Edit3, ArrowLeft, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';

const FinancialPlanView = ({ plan, onBack, onEdit }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getCapitalSourceIcon = (source) => {
        const icons = {
            'Pribadi': Users,
            'Pinjaman': TrendingUp,
            'Investor': DollarSign
        };
        return icons[source] || FileText;
    };

    const getProfitLossColor = (amount) => {
        return amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    const getProfitLossBackground = (amount) => {
        return amount >= 0 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    };

    if (!plan) {
        return (
            <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Memuat data rencana keuangan...</p>
            </div>
        );
    }

    const profitLoss = plan.profit_loss_estimation || (plan.estimated_monthly_income - plan.monthly_operational_cost);
    const profitMargin = plan.estimated_monthly_income > 0 ? (profitLoss / plan.estimated_monthly_income) * 100 : 0;
    const CapitalSourceIcon = getCapitalSourceIcon(plan.capital_source);

    // Helper function untuk mengakses business background
    const getBusinessInfo = (plan) => {
        if (!plan.business_background) {
            return {
                name: `Bisnis (ID: ${plan.business_background_id})`,
                category: 'Tidak ada kategori'
            };
        }

        return {
            name: plan.business_background.name || `Bisnis (ID: ${plan.business_background_id})`,
            category: plan.business_background.category || 'Tidak ada kategori'
        };
    };

    const businessInfo = getBusinessInfo(plan);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Detail Rencana Keuangan
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Lihat detail lengkap rencana keuangan
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => onEdit(plan)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <Edit3 size={16} />
                    Edit Rencana
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Business Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Building size={20} />
                            Informasi Bisnis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Nama Bisnis
                                </label>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {businessInfo.name}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Kategori Bisnis
                                </label>
                                <p className="text-gray-900 dark:text-white font-medium">
                                    {businessInfo.category}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <DollarSign size={20} />
                            Detail Keuangan
                        </h2>
                        
                        {/* Capital Source */}
                        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <CapitalSourceIcon size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                        Sumber Modal
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium text-lg">
                                        {plan.capital_source}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Numbers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Initial Capital */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Estimasi Modal Awal (CapEx)
                                </label>
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(plan.initial_capex)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Investasi awal untuk memulai bisnis
                                </p>
                            </div>

                            {/* Monthly Operational Cost */}
                            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Biaya Operasional per Bulan
                                </label>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                    {formatCurrency(plan.monthly_operational_cost)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Biaya rutin bulanan operasional
                                </p>
                            </div>

                            {/* Estimated Monthly Income */}
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Estimasi Pendapatan per Bulan
                                </label>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {formatCurrency(plan.estimated_monthly_income)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Pendapatan yang diharapkan per bulan
                                </p>
                            </div>

                            {/* Profit/Loss */}
                            <div className={`p-4 rounded-lg border ${getProfitLossBackground(profitLoss)}`}>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Estimasi Laba/Rugi per Bulan
                                </label>
                                <p className={`text-2xl font-bold ${getProfitLossColor(profitLoss)}`}>
                                    {formatCurrency(profitLoss)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {profitLoss >= 0 ? 'Laba' : 'Rugi'} bersih bulanan
                                </p>
                            </div>
                        </div>

                        {/* Profit Margin */}
                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                Margin Keuntungan
                            </label>
                            <div className="flex items-center justify-between">
                                <p className={`text-2xl font-bold ${
                                    profitMargin >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {profitMargin.toFixed(1)}%
                                </p>
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            profitMargin >= 0 ? 'bg-indigo-600' : 'bg-red-600'
                                        }`}
                                        style={{ width: `${Math.min(Math.abs(profitMargin), 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Persentase keuntungan dari total pendapatan
                            </p>
                        </div>
                    </div>

                    {/* Notes */}
                    {plan.notes && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText size={20} />
                                Catatan Tambahan
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {plan.notes}
                            </p>
                        </div>
                    )}
                </div>

                {/* Sidebar - Summary & Metadata */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Quick Summary */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Ringkasan Cepat
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    profitLoss >= 0 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                }`}>
                                    {profitLoss >= 0 ? 'Menguntungkan' : 'Merugi'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">ROI Bulanan:</span>
                                <span className={`text-sm font-medium ${
                                    profitMargin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                    {profitMargin.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Break-even Point:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {plan.monthly_operational_cost > 0 && profitLoss > 0
                                        ? Math.ceil(plan.initial_capex / profitLoss) + ' bulan'
                                        : 'Tidak tersedia'
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Calendar size={20} />
                            Informasi Sistem
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Dibuat Pada
                                </label>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {formatDate(plan.created_at)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                    Diperbarui Pada
                                </label>
                                <p className="text-sm text-gray-900 dark:text-white">
                                    {formatDate(plan.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Tindakan
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => onEdit(plan)}
                                className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Edit3 size={16} />
                                Edit Rencana
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                Kembali ke Daftar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialPlanView;