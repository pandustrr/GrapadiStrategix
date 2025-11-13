import { DollarSign, Building, ArrowLeft, Calculator, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';

const FinancialPlanForm = ({
    title,
    subtitle,
    formData,
    businesses,
    isLoadingBusinesses,
    isLoading,
    onInputChange,
    onSubmit,
    onBack,
    submitButtonText,
    submitButtonIcon,
    mode
}) => {
    // Calculate profit/loss and margin when financial data changes
    const calculations = {
        profitLoss: (parseFloat(formData.estimated_monthly_income) || 0) - (parseFloat(formData.monthly_operational_cost) || 0),
        profitMargin: (parseFloat(formData.estimated_monthly_income) || 0) > 0 ? 
            (((parseFloat(formData.estimated_monthly_income) || 0) - (parseFloat(formData.monthly_operational_cost) || 0)) / (parseFloat(formData.estimated_monthly_income) || 0)) * 100 : 0
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const isFormValid = formData.business_background_id && 
                       formData.initial_capex && 
                       formData.monthly_operational_cost && 
                       formData.estimated_monthly_income;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="mb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                </button>
                
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">
                    
                    {/* Pilih Bisnis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pilih Bisnis *
                        </label>
                        {isLoadingBusinesses ? (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                <span>Memuat data bisnis...</span>
                            </div>
                        ) : businesses.length === 0 ? (
                            <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Belum ada data bisnis. Silakan buat latar belakang bisnis terlebih dahulu.
                                </p>
                            </div>
                        ) : (
                            <select
                                name="business_background_id"
                                value={formData.business_background_id}
                                onChange={onInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Pilih Bisnis</option>
                                {businesses.map((business) => (
                                    <option key={business.id} value={business.id}>
                                        {business.name} - {business.category}
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Pilih bisnis untuk rencana keuangan ini
                        </p>
                    </div>

                    {/* Sumber Modal */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="text-blue-600 dark:text-blue-400" size={24} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sumber Modal</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {['Pribadi', 'Pinjaman', 'Investor'].map(source => (
                                <label key={source} className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800">
                                    <input
                                        type="radio"
                                        name="capital_source"
                                        value={source}
                                        checked={formData.capital_source === source}
                                        onChange={onInputChange}
                                        className="text-green-600 focus:ring-green-500"
                                        disabled={isLoading}
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {source}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Estimasi Keuangan */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign className="text-green-600 dark:text-green-400" size={24} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Estimasi Keuangan</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Modal Awal */}
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-800">
                                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Modal Awal</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">(Capital Expenditure)</p>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        name="initial_capex"
                                        value={formData.initial_capex}
                                        onChange={onInputChange}
                                        placeholder="0"
                                        min="0"
                                        step="100000"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-semibold text-green-600 dark:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {formData.initial_capex && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formatCurrency(formData.initial_capex)}
                                    </p>
                                )}
                            </div>

                            {/* Biaya Operasional */}
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-orange-200 dark:border-orange-800">
                                <TrendingDown className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Biaya Operasional</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">per Bulan</p>
                                <div className="relative">
                                    <TrendingDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        name="monthly_operational_cost"
                                        value={formData.monthly_operational_cost}
                                        onChange={onInputChange}
                                        placeholder="0"
                                        min="0"
                                        step="100000"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-semibold text-orange-600 dark:text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {formData.monthly_operational_cost && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formatCurrency(formData.monthly_operational_cost)}/bulan
                                    </p>
                                )}
                            </div>

                            {/* Estimasi Pendapatan */}
                            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-800">
                                <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Estimasi Pendapatan</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">per Bulan</p>
                                <div className="relative">
                                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    <input
                                        type="number"
                                        name="estimated_monthly_income"
                                        value={formData.estimated_monthly_income}
                                        onChange={onInputChange}
                                        placeholder="0"
                                        min="0"
                                        step="100000"
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-semibold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                {formData.estimated_monthly_income && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {formatCurrency(formData.estimated_monthly_income)}/bulan
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ringkasan Keuangan */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Calculator className="text-purple-600 dark:text-purple-400" size={24} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ringkasan Keuangan</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Estimasi Laba/Rugi */}
                            <div className={`p-4 rounded-lg border ${
                                calculations.profitLoss >= 0 
                                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                                    : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Estimasi Laba/Rugi per Bulan:
                                    </span>
                                    <span className={`text-lg font-bold ${
                                        calculations.profitLoss >= 0 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {formatCurrency(calculations.profitLoss)}
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {calculations.profitLoss >= 0 ? '✅ Laba' : '⚠️ Rugi'} bulanan
                                </div>
                            </div>

                            {/* Margin Keuntungan */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Margin Keuntungan:
                                    </span>
                                    <span className={`text-lg font-bold ${
                                        calculations.profitMargin >= 0 
                                            ? 'text-blue-600 dark:text-blue-400' 
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                        {calculations.profitMargin.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Persentase keuntungan dari pendapatan
                                </div>
                            </div>
                        </div>

                        {/* Informasi Tambahan */}
                        <div className="mt-4 space-y-2">
                            {calculations.profitLoss < 0 && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                                        ⚠️ Estimasi menunjukkan kerugian. Pertimbangkan untuk menyesuaikan biaya atau meningkatkan pendapatan.
                                    </div>
                                </div>
                            )}

                            {calculations.profitLoss > 0 && calculations.profitMargin > 20 && (
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="text-sm text-green-800 dark:text-green-300">
                                        ✅ Rencana keuangan sehat dengan margin keuntungan yang baik.
                                    </div>
                                </div>
                            )}

                            {calculations.profitLoss > 0 && calculations.profitMargin <= 20 && (
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <div className="text-sm text-blue-800 dark:text-blue-300">
                                        ℹ️ Rencana keuangan positif. Pertimbangkan untuk meningkatkan margin keuntungan.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Catatan Tambahan */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20">
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="text-gray-600 dark:text-gray-400" size={24} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Catatan Tambahan</h3>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Catatan & Penjelasan
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes || ''}
                                onChange={onInputChange}
                                rows={4}
                                placeholder="Tambahkan catatan, asumsi, atau penjelasan mengenai rencana keuangan ini. Contoh: perhitungan detail, strategi pengurangan biaya, rencana peningkatan pendapatan, dll."
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                disabled={isLoading}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Opsional: Tambahkan penjelasan untuk rencana keuangan Anda
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onBack}
                            disabled={isLoading}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={!isFormValid || isLoading || isLoadingBusinesses || businesses.length === 0}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    {submitButtonIcon}
                                    {submitButtonText}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FinancialPlanForm;