import backgroundApi from './backgroundApi';
import marketAnalysisApi from './marketAnalysisApi';

// Export individual APIs
export { default as backgroundApi } from './backgroundApi';
export { default as marketAnalysisApi } from './marketAnalysisApi';

// Export as grouped object (backward compatibility)
export const businessPlanAPI = {
    business: backgroundApi,
    marketAnalysis: marketAnalysisApi,
};

export default businessPlanAPI;