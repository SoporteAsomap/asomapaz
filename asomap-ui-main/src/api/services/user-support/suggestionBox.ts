import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import { debugLog, errorLog } from '@/utils/environment';
import type { 
  IProvincesAPIResponse, 
  IProvinceData,
  ISubmitSuggestionBox
} from '@/interfaces';

interface SuggestionBoxResponse {
  message: string;
}

export const suggestionBoxService = {
  getProvinces: async (): Promise<IProvinceData[]> => {
    try {
      debugLog('[SuggestionBoxService] Fetching provinces data');
      
      const response = await httpClient.get<IProvincesAPIResponse>(
        ENDPOINTS.COLLECTIONS.USER_SUPPORT.PROVINCES
      );

      debugLog('[SuggestionBoxService] API response:', response.data);

      // Extracción segura del arreglo
      const rawData: any[] = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.results || (response.data as any)?.data || [];

      if (!rawData || rawData.length === 0) {
        throw new Error('No provinces data found');
      }

      // Ahora iteramos sobre rawData en lugar de response.data
      const transformedData: IProvinceData[] = rawData.map((province: any) => ({
        id: province.id,
        name: province.name
      }));

      debugLog('[SuggestionBoxService] Transformed provinces data:', transformedData);
      
      return transformedData;

    } catch (error) {
      errorLog('[SuggestionBoxService] Error fetching provinces:', error);
      throw error;
    }
  },

  submitSuggestionBox: async (formData: ISubmitSuggestionBox): Promise<string> => {
    try {
      debugLog('[SuggestionBoxService] Submitting suggestion box form:', formData);
      
      const response = await httpClient.post<SuggestionBoxResponse, ISubmitSuggestionBox>(
        ENDPOINTS.COLLECTIONS.USER_SUPPORT.SUGGESTION_BOX,
        formData
      );

      debugLog('[SuggestionBoxService] Form submitted successfully:', response.data);
      
      return response.data.message;

    } catch (error) {
      errorLog('[SuggestionBoxService] Error submitting form:', error);
      throw error;
    }
  }
};