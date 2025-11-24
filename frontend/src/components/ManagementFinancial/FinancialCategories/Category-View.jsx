import { Edit3, Folder, TrendingUp, TrendingDown, Calendar, User, Tag } from 'lucide-react';

const CategoryView = ({ category, onBack, onEdit }) => {
    if (!category) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const getTypeIcon = (type) => {
        return type === 'income' ? 
            <TrendingUp className="text-green-600" size={20} /> : 
            <TrendingDown className="text-red-600" size={20} />;
    };

    const getTypeBadge = (type) => {
        const styles = {
            income: "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300",
            expense: "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300"
        };
        const labels = {
            income: "Pendapatan",
            expense: "Pengeluaran"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[type]}`}>
                {labels[type]}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const styles = {
            actual: "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300",
            plan: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300"
        };
        const labels = {
            actual: "Aktual",
            plan: "Rencana"
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Section dengan tombol back di atas */}
            <div className="mb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Kategori Keuangan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Lihat informasi lengkap kategori</p>
                    </div>
                    <button
                        onClick={() => onEdit(category)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">
                
                {/* Header dengan Icon dan Badges */}
                <div className="flex items-start gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                        <div 
                            className="w-24 h-24 border-2 rounded-lg flex items-center justify-center"
                            style={{ 
                                backgroundColor: `${category.color}20`,
                                borderColor: category.color
                            }}
                        >
                            {getTypeIcon(category.type)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{category.name}</h2>
                        <div className="flex flex-wrap gap-3">
                            {getTypeBadge(category.type)}
                            {getStatusBadge(category.status)}
                            <span 
                                className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                                style={{ 
                                    backgroundColor: `${category.color}20`,
                                    color: category.color
                                }}
                            >
                                <Tag size={14} />
                                Warna Kategori
                            </span>
                        </div>
                    </div>
                </div>

                {/* Informasi Utama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Folder size={20} />
                            Informasi Kategori
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nama Kategori
                                </label>
                                <p className="text-gray-900 dark:text-white text-lg font-medium">
                                    {category.name}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Jenis
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {getTypeIcon(category.type)}
                                        <span className="text-gray-900 dark:text-white">
                                            {category.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${
                                            category.status === 'actual' 
                                                ? 'bg-blue-500' 
                                                : 'bg-yellow-500'
                                        }`}></div>
                                        <span className="text-gray-900 dark:text-white">
                                            {category.status === 'actual' ? 'Aktual' : 'Rencana'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Warna
                                </label>
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-8 h-8 rounded border-2"
                                        style={{ 
                                            backgroundColor: category.color,
                                            borderColor: category.color
                                        }}
                                    ></div>
                                    <span className="text-gray-900 dark:text-white font-mono">
                                        {category.color}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar size={20} />
                            Informasi Sistem
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Dibuat Pada
                                </label>
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Calendar size={16} />
                                    {formatDate(category.created_at)}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Diperbarui Pada
                                </label>
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Calendar size={16} />
                                    {formatDate(category.updated_at)}
                                </div>
                            </div>

                            {category.user && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Dibuat Oleh
                                    </label>
                                    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                                        <User size={16} />
                                        {category.user.name || 'User'}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Deskripsi */}
                {category.description && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deskripsi</h3>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                            <p className="text-gray-900 dark:text-white whitespace-pre-line leading-relaxed">
                                {category.description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Statistik (placeholder untuk fitur transaksi nanti) */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Statistik Kategori</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">0</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Transaksi</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
                            <p className={`text-2xl font-bold mb-1 ${
                                category.type === 'income' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                            }`}>
                                Rp 0
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Total {category.type === 'income' ? 'Pendapatan' : 'Pengeluaran'}
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 text-center">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">-</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Rata-rata per Bulan</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                        * Statistik akan tersedia setelah menambahkan transaksi
                    </p>
                </div>

                {/* Action Buttons di bagian bawah */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Kembali ke Daftar
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit3 size={16} />
                        Edit Kategori
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryView;