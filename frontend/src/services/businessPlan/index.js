// frontend/src/services/businessPlan/index.js

// Import semua API terlebih dahulu
import backgroundApi from './backgroundApi';
import marketAnalysisApi from './marketAnalysisApi';
import productServiceApi from './productServiceApi';
import marketingStrategiesApi from './marketingStrategiesApi';
import operationalPlanApi from './operationalPlanApi';
import teamStructureApi from './teamStructureApi';
import financialPlanApi from './financialPlanApi';

// Export individual APIs
export {
  backgroundApi,
  marketAnalysisApi,
  productServiceApi,
  marketingStrategiesApi,
  operationalPlanApi,
  teamStructureApi,
  financialPlanApi
};

// Export as grouped object (backward compatibility)
const businessPlanAPI = {
  business: backgroundApi,
  marketAnalysis: marketAnalysisApi,
  productService: productServiceApi,
  marketingStrategies: marketingStrategiesApi,
  operationalPlan: operationalPlanApi,
  teamStructure: teamStructureApi,
  financialPlan: financialPlanApi,
};

export default businessPlanAPI;