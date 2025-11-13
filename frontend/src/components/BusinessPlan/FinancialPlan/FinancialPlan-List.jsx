import { DollarSign, Building, Calendar, Plus, Eye, Edit3, Trash2, Loader, RefreshCw, TrendingUp, TrendingDown, Users, MapPin } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const FinancialPlanList = ({
    plans,
    onView,
    onEdit,
    onDelete,
    onCreateNew,
    isLoading,
    error,
    onRetry,
    onBack
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedBusiness, setSelectedBusiness] = useState('all');

    const handleDeleteClick = (planId, planName) => {
        setPlanToDelete({ id: planId, name: planName });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!planToDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(planToDelete.id);
            toast.success('Rencana keuangan berhasil dihapus!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } catch (error) {
            console.error('Error in FinancialPlanList delete:', error);
            toast.error('Gagal menghapus rencana keuangan!', {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setPlanToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setPlanToDelete(null);
    };

    // Get unique businesses for filter
    const getUniqueBusinesses = () => {
        const businesses = plans
            .filter(plan => plan.business_background && plan.business_background.id)
            .map(plan => ({
                id: plan.business_background.id,
                name: plan.business_background.name,
                category: plan.business_background.category || 'Tidak ada kategori'
            }));

        // Remove duplicates
        return businesses.filter((business, index, self) =>
            index === self.findIndex(b => b.id === business.id)
        );
    };

    const filteredPlans = selectedBusiness === 'all'
        ? plans
        : plans.filter(plan =>
            plan.business_background?.id === selectedBusiness
        );

    const uniqueBusinesses = getUniqueBusinesses();

    // Helper function untuk mengakses business background
    const getBusinessInfo = (plan) => {
        if (!plan.business_background) {
            return {
                name: `Bisnis (ID: ${plan.business_background_id})`,
                category: 'Tidak ada kategori',
                location: 'Lokasi tidak tersedia'
            };
        }

        return {
            name: plan.business_background.name || `Bisnis (ID: ${plan.business_background_id})`,
            category: plan.business_background.category || 'Tidak ada kategori',
            location: plan.business_background.location || 'Lokasi tidak tersedia'
        };
    };

    const getCapitalSourceBadge = (source) => {
        const sourceConfig = {
            'Pribadi': { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: Users },
            'Pinjaman': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: TrendingUp },
            'Investor': { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', icon: DollarSign }
        };

        const config = sourceConfig[source] || sourceConfig.Pribadi;
        const Icon = config.icon;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1 w-fit`}>
                <Icon size={12} />
                {source}
            </span>
        );
    };

    const getProfitLossBadge = (amount) => {
        const isProfit = amount >= 0;
        const config = isProfit
            ? { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: TrendingUp, label: 'Laba' }
            : { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', icon: TrendingDown, label: 'Rugi' };

        const Icon = config.icon;

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center gap-1 w-fit`}>
                <Icon size={12} />
                {config.label}: {formatCurrency(Math.abs(amount))}
            </span>
        );
    };

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
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // LOADING STATE
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rencana Keuangan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola sumber modal, estimasi biaya, dan analisis keuangan</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Loader className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ERROR STATE
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rencana Keuangan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola sumber modal, estimasi biaya, dan analisis keuangan</p>
                    </div>
                </div>
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Gagal Memuat Data</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        {error}
                    </p>
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto"
                    >
                        <RefreshCw size={16} />
                        Coba Lagi
                    </button>
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
                                <Trash2 size={20} />
                            </button>
                        </div>

                        <div className="mb-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Apakah Anda yakin ingin menghapus rencana keuangan ini?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>"{planToDelete?.name}"</strong>
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
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rencana Keuangan</h1>
                    <p className="text-gray-600 dark:text-gray-400">Kelola sumber modal, estimasi biaya, dan analisis keuangan</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Tambah Rencana
                </button>
            </div>

            {/* FILTER SECTION */}
            {plans.length > 0 && uniqueBusinesses.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Building size={16} />
                        Filter Berdasarkan Bisnis:
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedBusiness('all')}
                            className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm flex items-center gap-2 ${
                                selectedBusiness === 'all'
                                    ? 'bg-green-500 border-green-500 text-white shadow-sm'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Building size={14} />
                            Semua Bisnis
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                selectedBusiness === 'all'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                            }`}>
                                {plans.length}
                            </span>
                        </button>

                        {uniqueBusinesses.map(business => (
                            <button
                                key={business.id}
                                onClick={() => setSelectedBusiness(business.id)}
                                className={`px-3 py-2 rounded-lg border transition-all duration-200 text-sm flex items-center gap-2 ${
                                    selectedBusiness === business.id
                                        ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                            >
                                <Building size={14} />
                                {business.name}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    selectedBusiness === business.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                }`}>
                                    {plans.filter(p => p.business_background?.id === business.id).length}
                                </span>
                            </button>
                        ))}
                    </div>

                    {selectedBusiness !== 'all' && (
                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 text-sm">
                                <Building size={16} />
                                <span>
                                    Menampilkan {filteredPlans.length} dari {plans.length} rencana keuangan untuk{' '}
                                    <strong>{uniqueBusinesses.find(b => b.id === selectedBusiness)?.name}</strong>
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* CARD LIST */}
            {plans.length === 0 ? (
                <div className="text-center py-12">
                    <DollarSign size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada rencana keuangan</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan menambahkan rencana keuangan pertama Anda</p>
                    <button
                        onClick={onCreateNew}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Tambah Rencana Pertama
                    </button>
                </div>
            ) : filteredPlans.length === 0 ? (
                <div className="text-center py-12">
                    <Building size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Tidak ada rencana keuangan untuk bisnis ini</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Tidak ditemukan rencana keuangan untuk bisnis yang dipilih</p>
                    <button
                        onClick={() => setSelectedBusiness('all')}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Lihat Semua Rencana
                    </button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlans.map((plan) => {
                            const businessInfo = getBusinessInfo(plan);
                            const profitLoss = plan.profit_loss_estimation || (plan.estimated_monthly_income - plan.monthly_operational_cost);
                            
                            return (
                                <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                    {/* Header dengan info bisnis */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
                                                <DollarSign className="text-indigo-600 dark:text-indigo-400" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                    {businessInfo.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {businessInfo.category}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Lokasi */}
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <MapPin size={14} />
                                        <span className="line-clamp-1">{businessInfo.location}</span>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {getCapitalSourceBadge(plan.capital_source)}
                                        {getProfitLossBadge(profitLoss)}
                                    </div>

                                    {/* Detail Keuangan */}
                                    <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span>Modal Awal:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(plan.initial_capex)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Biaya Operasional:</span>
                                            <span className="font-semibold text-orange-600 dark:text-orange-400">
                                                {formatCurrency(plan.monthly_operational_cost)}/bulan
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span>Estimasi Pendapatan:</span>
                                            <span className="font-semibold text-green-600 dark:text-green-400">
                                                {formatCurrency(plan.estimated_monthly_income)}/bulan
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tanggal Dibuat */}
                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
                                        <Calendar size={12} />
                                        <span>Dibuat: {formatDate(plan.created_at)}</span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onView(plan)}
                                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Eye size={16} />
                                            Lihat
                                        </button>
                                        <button
                                            onClick={() => onEdit(plan)}
                                            className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Edit3 size={16} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(plan.id, businessInfo.name)}
                                            className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Trash2 size={16} />
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Info Jumlah Data */}
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Menampilkan {filteredPlans.length} dari {plans.length} rencana keuangan
                        {selectedBusiness !== 'all' && (
                            <span> untuk <strong>{uniqueBusinesses.find(b => b.id === selectedBusiness)?.name}</strong></span>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FinancialPlanList;