import { Workflow, MapPin, Users, Clock, Truck, Plus, Eye, Edit3, Trash2, Loader } from 'lucide-react';

const OperationalList = ({ 
    operationalPlans, 
    onView, 
    onEdit, 
    onDelete, 
    onCreateNew,
    isLoading 
}) => {
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rencana Operasional</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola rencana operasional bisnis Anda</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <Loader className="animate-spin h-8 w-8 text-green-600" />
                </div>
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rencana Operasional</h1>
                    <p className="text-gray-600 dark:text-gray-400">Kelola rencana operasional bisnis Anda</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Tambah Rencana
                </button>
            </div>

            {operationalPlans.length === 0 ? (
                <div className="text-center py-12">
                    <Workflow size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada rencana operasional</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan membuat rencana operasional pertama Anda</p>
                    <button
                        onClick={onCreateNew}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Buat Rencana Pertama
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {operationalPlans.map((plan) => (
                        <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                        <Workflow className="text-blue-600 dark:text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                            {plan.business_name || 'Rencana Operasional'}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status || 'draft')}`}>
                                                {getStatusText(plan.status || 'draft')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                {plan.business_location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} />
                                        <span className="line-clamp-1">{plan.business_location}</span>
                                    </div>
                                )}
                                
                                {plan.employees && plan.employees.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Users size={16} />
                                        <span>{plan.employees.length} posisi karyawan</span>
                                    </div>
                                )}
                                
                                {plan.suppliers && plan.suppliers.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} />
                                        <span>{plan.suppliers.length} supplier</span>
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    <span>Jam operasional teratur</span>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 min-h-[40px]">
                                {plan.location_description || 'Rencana operasional bisnis yang komprehensif'}
                            </p>

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
                                    onClick={() => onDelete(plan.id)}
                                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Trash2 size={16} />
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OperationalList;