import { Edit3, Workflow, MapPin, Users, Clock, Truck, Building, Calendar } from 'lucide-react';

const OperationalView = ({ plan, onBack, onEdit }) => {
    if (!plan) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'Aktif';
            case 'draft': return 'Draft';
            case 'inactive': return 'Nonaktif';
            default: return status;
        }
    };

    const getLocationTypeText = (type) => {
        switch (type) {
            case 'owned': return 'Milik Sendiri';
            case 'rented': return 'Sewa';
            case 'leased': return 'Sewa Jangka Panjang';
            case 'virtual': return 'Virtual/Online';
            case 'other': return 'Lainnya';
            default: return type;
        }
    };

    const getDayName = (day) => {
        const days = {
            monday: 'Senin',
            tuesday: 'Selasa',
            wednesday: 'Rabu',
            thursday: 'Kamis',
            friday: 'Jumat',
            saturday: 'Sabtu',
            sunday: 'Minggu'
        };
        return days[day] || day;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali ke Daftar
                </button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Rencana Operasional</h1>
                    <p className="text-gray-600 dark:text-gray-400">Lihat detail lengkap rencana operasional</p>
                </div>
                <button
                    onClick={() => onEdit(plan)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                    <Edit3 size={16} />
                    Edit
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">
                
                {/* Header */}
                <div className="flex items-start gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                            <Workflow className="w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {plan.business_name || 'Rencana Operasional'}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className={`px-3 py-1 rounded-full ${getStatusColor(plan.status || 'draft')}`}>
                                {getStatusText(plan.status || 'draft')}
                            </span>
                            <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full">
                                {getLocationTypeText(plan.location_type)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Informasi Lokasi */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin size={20} />
                        Informasi Lokasi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Alamat Lengkap
                                </label>
                                <p className="text-gray-900 dark:text-white">{plan.business_location || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Deskripsi Lokasi
                                </label>
                                <p className="text-gray-900 dark:text-white whitespace-pre-line">
                                    {plan.location_description || '-'}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Luas Lokasi
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {plan.location_size ? `${plan.location_size} m²` : '-'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Biaya Sewa
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {plan.rent_cost ? `Rp ${parseInt(plan.rent_cost).toLocaleString('id-ID')} per bulan` : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Karyawan */}
                {plan.employees && plan.employees.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Users size={20} />
                            Struktur Karyawan
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plan.employees.map((employee, index) => (
                                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        {employee.role}
                                    </h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p>Jumlah: {employee.count} orang</p>
                                        {employee.salary && (
                                            <p>Gaji: Rp {parseInt(employee.salary).toLocaleString('id-ID')} per bulan</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Jam Operasional */}
                {plan.operational_hours && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock size={20} />
                            Jam Operasional
                        </h3>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.entries(plan.operational_hours).map(([day, hours]) => (
                                <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white capitalize">
                                        {getDayName(day)}
                                    </span>
                                    {hours.closed ? (
                                        <span className="text-red-600 dark:text-red-400 font-medium">Tutup</span>
                                    ) : (
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {hours.open} - {hours.close}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Supplier */}
                {plan.suppliers && plan.suppliers.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Truck size={20} />
                            Supplier & Mitra Bisnis
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plan.suppliers.map((supplier, index) => (
                                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                        {supplier.name}
                                    </h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                        <p>Produk: {supplier.product}</p>
                                        {supplier.contact && <p>Kontak: {supplier.contact}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Alur Kerja & Kebutuhan */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Workflow size={20} />
                        Alur Kerja & Kebutuhan
                    </h3>
                    
                    {plan.daily_workflow && (
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Alur Kerja Harian</h4>
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <p className="text-gray-900 dark:text-white whitespace-pre-line">
                                    {plan.daily_workflow}
                                </p>
                            </div>
                        </div>
                    )}

                    {plan.equipment_needs && (
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Kebutuhan Peralatan</h4>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <p className="text-gray-900 dark:text-white whitespace-pre-line">
                                    {plan.equipment_needs}
                                </p>
                            </div>
                        </div>
                    )}

                    {plan.technology_stack && (
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Teknologi & Software</h4>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                                <p className="text-gray-900 dark:text-white whitespace-pre-line">
                                    {plan.technology_stack}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
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
                        onClick={() => onEdit(plan)}
                        className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit3 size={16} />
                        Edit Rencana
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OperationalView;