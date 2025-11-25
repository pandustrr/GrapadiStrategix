import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Edit3, Save, X } from 'lucide-react';
import { toast } from 'react-toastify';

const YearManager = ({ 
    availableYears, 
    selectedYear, 
    onYearChange, 
    onAddYear, 
    onDeleteYear,
    summaries 
}) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [newYear, setNewYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        // Auto-fill dengan tahun berikutnya ketika modal dibuka
        if (showAddModal && !newYear) {
            const nextYear = Math.max(...availableYears, currentYear) + 1;
            setNewYear(nextYear.toString());
        }
    }, [showAddModal, availableYears, currentYear]);

    const handleAddYear = async () => {
        const year = parseInt(newYear);
        
        if (!year || year < 2020 || year > 2030) {
            toast.error('Tahun harus antara 2020 - 2030');
            return;
        }

        if (availableYears.includes(year)) {
            toast.error(`Tahun ${year} sudah tersedia`);
            return;
        }

        setIsLoading(true);
        try {
            await onAddYear(year);
            setNewYear('');
            setShowAddModal(false);
            toast.success(`Tahun ${year} berhasil ditambahkan`);
        } catch (error) {
            toast.error('Gagal menambahkan tahun');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteYear = async (yearToDelete) => {
        if (yearToDelete === currentYear) {
            toast.error('Tidak dapat menghapus tahun berjalan');
            return;
        }

        const summariesInYear = summaries.filter(s => s.year === yearToDelete);
        
        if (summariesInYear.length > 0) {
            const confirmDelete = window.confirm(
                `Tahun ${yearToDelete} memiliki ${summariesInYear.length} data ringkasan. Data akan dihapus permanen. Yakin ingin menghapus?`
            );
            
            if (!confirmDelete) return;
        } else {
            const confirmDelete = window.confirm(
                `Hapus tahun ${yearToDelete} dari daftar?`
            );
            
            if (!confirmDelete) return;
        }

        try {
            await onDeleteYear(yearToDelete);
            toast.success(`Tahun ${yearToDelete} berhasil dihapus`);
        } catch (error) {
            toast.error('Gagal menghapus tahun');
        }
    };

    const canDeleteYear = (year) => {
        return year !== currentYear && availableYears.length > 1;
    };

    const getSummaryCount = (year) => {
        return summaries.filter(s => s.year === year).length;
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Year Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            Tahun {selectedYear}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getSummaryCount(selectedYear)} ringkasan bulanan
                        </p>
                    </div>
                </div>
            </div>

            {/* Year Controls */}
            <div className="flex items-center gap-2">
                {/* Year Selector */}
                <select
                    value={selectedYear}
                    onChange={(e) => onYearChange(parseInt(e.target.value))}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white bg-white text-sm"
                >
                    {availableYears.map(year => (
                        <option key={year} value={year}>
                            {year} 
                        </option>
                    ))}
                </select>

                {/* Add Year Button */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    title="Tambah Tahun Baru"
                >
                    <Plus size={16} />
                    <span className="hidden sm:inline text-sm">Tambah</span>
                </button>

                {/* Delete Year Button */}
                {canDeleteYear(selectedYear) && (
                    <button
                        onClick={() => handleDeleteYear(selectedYear)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        title="Hapus Tahun"
                    >
                        <Trash2 size={16} />
                        <span className="hidden sm:inline text-sm">Hapus</span>
                    </button>
                )}
            </div>

            {/* Add Year Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                    <Plus className="text-green-600 dark:text-green-400" size={16} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Tambah Tahun Baru
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tahun
                                </label>
                                <input
                                    type="number"
                                    value={newYear}
                                    onChange={(e) => setNewYear(e.target.value)}
                                    min="2020"
                                    max="2030"
                                    placeholder="2024"
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                />
                                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span>Rentang: 2020 - 2030</span>
                                    <span>Tahun terakhir: {Math.max(...availableYears)}</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 text-sm">
                                    <Calendar size={16} />
                                    <span className="font-medium">Info Tahun Baru</span>
                                </div>
                                <p className="text-blue-700 dark:text-blue-400 text-xs mt-1">
                                    Tahun baru akan dibuat tanpa data ringkasan. Anda bisa menambahkan ringkasan bulanan secara manual.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleAddYear}
                                    disabled={isLoading || !newYear}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Menambah...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            Tambah Tahun
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearManager;