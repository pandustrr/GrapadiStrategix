import { useState, useEffect } from 'react';
import OperationalList from './Operational-List';
import OperationalCreate from './Operational-Create';
import OperationalEdit from './Operational-Edit';
import OperationalView from './Operational-View';
import { businessPlanAPI } from '../../../services/businessPlanApi';

const Operational = () => {
    const [operationalPlans, setOperationalPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [view, setView] = useState('list');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch semua operational plans
    const fetchOperationalPlans = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('Fetching operational plans using API...');
            const response = await businessPlanAPI.operational.getAll();
            
            console.log('API Response:', response.data);
            
            if (response.data.status === 'success') {
                setOperationalPlans(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch operational plans');
            }
        } catch (error) {
            console.error('Error fetching operational plans:', error);
            
            let errorMessage = 'Gagal memuat data rencana operasional';
            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            } else {
                errorMessage = error.message;
            }
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOperationalPlans();
    }, []);

    // Handler functions
    const handleCreateNew = () => {
        setCurrentPlan(null);
        setView('create');
    };

    const handleView = (plan) => {
        setCurrentPlan(plan);
        setView('view');
    };

    const handleEdit = (plan) => {
        setCurrentPlan(plan);
        setView('edit');
    };

    const handleDelete = async (planId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus rencana operasional ini?')) {
            return;
        }

        try {
            setError(null);
            const response = await businessPlanAPI.operational.delete(planId);

            if (response.data.status === 'success') {
                alert('Rencana operasional berhasil dihapus!');
                fetchOperationalPlans();
                setView('list');
            } else {
                throw new Error(response.data.message || 'Failed to delete operational plan');
            }
        } catch (error) {
            console.error('Error deleting operational plan:', error);
            let errorMessage = 'Terjadi kesalahan saat menghapus rencana operasional';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            alert(errorMessage);
        }
    };

    const handleBackToList = () => {
        setView('list');
        setCurrentPlan(null);
        setError(null);
    };

    const handleCreateSuccess = () => {
        fetchOperationalPlans();
        setView('list');
    };

    const handleUpdateSuccess = () => {
        fetchOperationalPlans();
        setView('list');
    };

    const handleRetry = () => {
        fetchOperationalPlans();
    };

    // Render loading state
    if (isLoading && view === 'list') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Memuat data rencana operasional...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render different views
    const renderView = () => {
        switch (view) {
            case 'list':
                return (
                    <OperationalList
                        operationalPlans={operationalPlans}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCreateNew={handleCreateNew}
                        isLoading={isLoading}
                        error={error}
                        onRetry={handleRetry}
                    />
                );
            case 'create':
                return (
                    <OperationalCreate
                        onBack={handleBackToList}
                        onSuccess={handleCreateSuccess}
                    />
                );
            case 'edit':
                return (
                    <OperationalEdit
                        plan={currentPlan}
                        onBack={handleBackToList}
                        onSuccess={handleUpdateSuccess}
                    />
                );
            case 'view':
                return (
                    <OperationalView
                        plan={currentPlan}
                        onBack={handleBackToList}
                        onEdit={handleEdit}
                    />
                );
            default:
                return (
                    <OperationalList
                        operationalPlans={operationalPlans}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCreateNew={handleCreateNew}
                        isLoading={isLoading}
                        error={error}
                        onRetry={handleRetry}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderView()}
            </div>
        </div>
    );
};

export default Operational;