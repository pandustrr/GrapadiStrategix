import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import OperationalForm from './Operational-Form';

const OperationalEdit = ({ plan, onBack, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        business_background_id: '',
        business_location: '',
        location_description: '',
        location_type: 'owned',
        location_size: '',
        rent_cost: '',
        employees: [],
        suppliers: [],
        daily_workflow: '',
        equipment_needs: '',
        technology_stack: '',
        status: 'draft'
    });

    const [operationalHours, setOperationalHours] = useState({
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: false },
        sunday: { open: '09:00', close: '17:00', closed: false }
    });

    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        if (plan) {
            setFormData({
                business_background_id: plan.business_background_id || '',
                business_location: plan.business_location || '',
                location_description: plan.location_description || '',
                location_type: plan.location_type || 'owned',
                location_size: plan.location_size || '',
                rent_cost: plan.rent_cost || '',
                employees: plan.employees || [],
                suppliers: plan.suppliers || [],
                daily_workflow: plan.daily_workflow || '',
                equipment_needs: plan.equipment_needs || '',
                technology_stack: plan.technology_stack || '',
                status: plan.status || 'draft'
            });

            if (plan.operational_hours) {
                setOperationalHours(plan.operational_hours);
            }
        }
    }, [plan]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOperationalHoursChange = (day, field, value) => {
        setOperationalHours(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user || !user.id) {
                throw new Error('User data not found');
            }

            const submitData = {
                ...formData,
                operational_hours: operationalHours,
                user_id: user.id
            };

            const response = await fetch(`http://localhost:8000/api/operational-plans/${plan.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                alert('Rencana operasional berhasil diperbarui!');
                onSuccess();
            } else {
                throw new Error(data.message || 'Terjadi kesalahan');
            }
        } catch (error) {
            console.error('Error updating operational plan:', error);
            alert('Terjadi kesalahan saat memperbarui rencana operasional: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (!plan) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <OperationalForm
            title="Edit Rencana Operasional"
            subtitle="Perbarui informasi rencana operasional"
            formData={formData}
            operationalHours={operationalHours}
            currentStep={currentStep}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onOperationalHoursChange={handleOperationalHoursChange}
            onStepChange={setCurrentStep}
            onSubmit={handleSubmit}
            onBack={onBack}
            submitButtonText="Perbarui Rencana"
            submitButtonIcon={<Save size={16} />}
            mode="edit"
        />
    );
};

export default OperationalEdit;