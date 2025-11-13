import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import FinancialPlanForm from './FinancialPlan-Form';
import { financialPlanApi, backgroundApi } from '../../../services/businessPlan';
import { toast } from 'react-toastify';

const FinancialPlanCreate = ({ onBack, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [businesses, setBusinesses] = useState([]);
    const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);

    const [formData, setFormData] = useState({
        business_background_id: '',
        capital_source: 'Pribadi',
        initial_capex: '',
        monthly_operational_cost: '',
        estimated_monthly_income: '',
        notes: ''
    });

    // Fetch business backgrounds untuk dropdown
    const fetchBusinesses = async () => {
        try {
            setIsLoadingBusinesses(true);
            const response = await backgroundApi.getAll();
            
            console.log('Business backgrounds response:', response);
            
            if (response.data && response.data.status === 'success') {
                setBusinesses(response.data.data || []);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch business backgrounds');
            }
        } catch (error) {
            console.error('Error fetching businesses:', error);
            let errorMessage = 'Gagal memuat data bisnis';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoadingBusinesses(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        console.log('Form data before submit:', formData);
        
        // Validasi: business background harus dipilih
        if (!formData.business_background_id) {
            toast.error('Pilih bisnis terlebih dahulu');
            return;
        }

        // Validasi input angka
        if (parseFloat(formData.initial_capex) < 0 || 
            parseFloat(formData.monthly_operational_cost) < 0 || 
            parseFloat(formData.estimated_monthly_income) < 0) {
            toast.error('Nilai tidak boleh negatif');
            return;
        }

        setIsLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user || !user.id) {
                throw new Error('User data not found');
            }

            const submitData = {
                ...formData,
                user_id: user.id,
                initial_capex: parseFloat(formData.initial_capex) || 0,
                monthly_operational_cost: parseFloat(formData.monthly_operational_cost) || 0,
                estimated_monthly_income: parseFloat(formData.estimated_monthly_income) || 0
            };

            console.log('Submitting financial plan data:', submitData);
            
            const response = await financialPlanApi.create(submitData);
            console.log('Financial plan create response:', response);

            // Handle different response structures
            if (response.status === 'success' || (response.data && response.data.status === 'success')) {
                toast.success('Rencana keuangan berhasil dibuat!');
                onSuccess();
            } else {
                const errorMessage = response.data?.message || response.message || 'Terjadi kesalahan';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Error creating financial plan:', error);
            
            let errorMessage = 'Terjadi kesalahan saat membuat rencana keuangan';
            
            // Handle different error structures
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                const errors = Object.values(error.response.data.errors).flat();
                errorMessage = errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            } else if (error.data?.message) {
                errorMessage = error.data.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <FinancialPlanForm
            title="Tambah Rencana Keuangan"
            subtitle="Isi formulir untuk menambahkan rencana keuangan baru"
            formData={formData}
            businesses={businesses}
            isLoadingBusinesses={isLoadingBusinesses}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onBack={onBack}
            submitButtonText="Simpan Rencana"
            submitButtonIcon={<Save size={16} />}
            mode="create"
        />
    );
};

export default FinancialPlanCreate;