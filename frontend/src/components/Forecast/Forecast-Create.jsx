import React, { useState } from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { forecastDataApi } from '../../services/ManagementFinancial/forecastApi';

const ForecastCreate = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        income_sales: '',
        income_other: '',
        expense_operational: '',
        expense_other: '',
        seasonal_factor: '1.0',
        notes: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!formData.income_sales || !formData.expense_operational) {
                setError('Pendapatan penjualan dan pengeluaran operasional harus diisi');
                setLoading(false);
                return;
            }

            const response = await forecastDataApi.create({
                month: parseInt(formData.month),
                year: parseInt(formData.year),
                income_sales: parseFloat(formData.income_sales),
                income_other: parseFloat(formData.income_other) || 0,
                expense_operational: parseFloat(formData.expense_operational),
                expense_other: parseFloat(formData.expense_other) || 0,
                seasonal_factor: parseFloat(formData.seasonal_factor),
                notes: formData.notes,
            });

            if (response.success) {
                onSuccess();
            } else {
                setError(response.message || 'Gagal membuat forecast');
            }
        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat membuat forecast');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Buat Data Forecast Baru
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Masukkan data historis untuk prediksi akurat
                    </p>
                </div>
            </div>

            {error && (
                <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
                    <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Periode */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Periode</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="month" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Bulan
                                </label>
                                <select
                                    id="month"
                                    name="month"
                                    value={formData.month}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
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

                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tahun
                                </label>
                                <input
                                    id="year"
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pendapatan */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pendapatan</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="income_sales" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pendapatan Penjualan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="income_sales"
                                    type="number"
                                    name="income_sales"
                                    value={formData.income_sales}
                                    onChange={handleChange}
                                    placeholder="0"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="income_other" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pendapatan Lain
                                </label>
                                <input
                                    id="income_other"
                                    type="number"
                                    name="income_other"
                                    value={formData.income_other}
                                    onChange={handleChange}
                                    placeholder="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pengeluaran */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pengeluaran</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="expense_operational" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pengeluaran Operasional <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="expense_operational"
                                    type="number"
                                    name="expense_operational"
                                    value={formData.expense_operational}
                                    onChange={handleChange}
                                    placeholder="0"
                                    step="0.01"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="expense_other" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Pengeluaran Lain
                                </label>
                                <input
                                    id="expense_other"
                                    type="number"
                                    name="expense_other"
                                    value={formData.expense_other}
                                    onChange={handleChange}
                                    placeholder="0"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Faktor Musiman */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Faktor Musiman</h3>
                        <div>
                            <label htmlFor="seasonal_factor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Faktor Seasonal (1.0 = Normal)
                            </label>
                            <input
                                id="seasonal_factor"
                                type="number"
                                name="seasonal_factor"
                                value={formData.seasonal_factor}
                                onChange={handleChange}
                                placeholder="1.0"
                                step="0.1"
                                min="0.1"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Gunakan nilai &gt; 1 untuk bulan dengan potensi penjualan lebih tinggi
                            </p>
                        </div>
                    </div>

                    {/* Catatan */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Catatan</h3>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Tambahkan catatan atau konteks untuk forecast ini"
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 font-medium"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50"
                        >
                            {loading ? 'Membuat...' : 'Buat Forecast'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-6 rounded-lg">
                <div className="flex gap-4">
                    <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            Panduan Membuat Forecast
                        </h4>
                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                            <li>Isi data historis penjualan dan pengeluaran untuk bulan yang akurat</li>
                            <li>Faktor seasonal membantu menyesuaikan prediksi untuk musim tertentu</li>
                            <li>Sistem akan menganalisis data dan memberikan prediksi 12 bulan ke depan</li>
                            <li>Semakin banyak data historis, semakin akurat prediksinya</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForecastCreate;
