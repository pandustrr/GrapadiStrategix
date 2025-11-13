import { useState, useEffect } from 'react';
import FinancialPlanList from './FinancialPlan-List';
import FinancialPlanCreate from './FinancialPlan-Create';
import FinancialPlanEdit from './FinancialPlan-Edit';
import FinancialPlanView from './FinancialPlan-View';
import FinancialPlanForm from './FinancialPlan-Form';
import { financialPlanApi } from '../../../services/businessPlan';
import { toast } from 'react-toastify';

const FinancialPlan = ({ onBack }) => {
    const [plans, setPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [view, setView] = useState('list');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch semua financial plans
    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const user = JSON.parse(localStorage.getItem('user'));
            
            const response = await financialPlanApi.getAll({ 
                user_id: user?.id
            });

            if (response.status === 'success') {
                setPlans(response.data || []);
            } else {
                throw new Error(response.message || 'Failed to fetch financial plans');
            }
        } catch (error) {
            let errorMessage = 'Gagal memuat data rencana keuangan';
            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
            } else {
                errorMessage = error.message;
            }

            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
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
        try {
            setError(null);
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await financialPlanApi.delete(planId, user?.id);

            if (response.status === 'success') {
                toast.success('Rencana keuangan berhasil dihapus!');
                fetchPlans();
                setView('list');
            } else {
                throw new Error(response.message || 'Failed to delete financial plan');
            }
        } catch (error) {
            let errorMessage = 'Terjadi kesalahan saat menghapus data rencana keuangan';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            toast.error(errorMessage);
        }
    };

    const handleBackToList = () => {
        setView('list');
        setCurrentPlan(null);
        setError(null);
    };

    const handleCreateSuccess = () => {
        fetchPlans();
        setView('list');
    };

    const handleUpdateSuccess = () => {
        fetchPlans();
        setView('list');
    };

    const handleRetry = () => {
        fetchPlans();
    };

    // Render loading state
    if (isLoading && view === 'list') {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-600 dark:text-gray-400">Memuat data rencana keuangan...</p>
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
                    <FinancialPlanList
                        plans={plans}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCreateNew={handleCreateNew}
                        isLoading={isLoading}
                        error={error}
                        onRetry={handleRetry}
                        onBack={onBack}
                    />
                );
            case 'create':
                return (
                    <FinancialPlanCreate
                        onBack={handleBackToList}
                        onSuccess={handleCreateSuccess}
                    />
                );
            case 'edit':
                return (
                    <FinancialPlanEdit
                        plan={currentPlan}
                        onBack={handleBackToList}
                        onSuccess={handleUpdateSuccess}
                    />
                );
            case 'view':
                return (
                    <FinancialPlanView
                        plan={currentPlan}
                        onBack={handleBackToList}
                        onEdit={handleEdit}
                    />
                );
            default:
                return (
                    <FinancialPlanList
                        plans={plans}
                        onView={handleView}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onCreateNew={handleCreateNew}
                        isLoading={isLoading}
                        error={error}
                        onRetry={handleRetry}
                        onBack={onBack}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {renderView()}
            </div>
        </div>
    );
};

export default FinancialPlan;