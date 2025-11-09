import backgroundApi from './backgroundApi';
import marketAnalysisApi from './marketAnalysisApi';
import productServiceApi from './productServiceApi';

// Export individual APIs
export { default as backgroundApi } from './backgroundApi';
export { default as marketAnalysisApi } from './marketAnalysisApi';
export { default as productServiceApi } from './productServiceApi';

// Export as grouped object (backward compatibility)
export const businessPlanAPI = {
    business: backgroundApi,
    marketAnalysis: marketAnalysisApi,
    productService: productServiceApi,
};

export default businessPlanAPI;