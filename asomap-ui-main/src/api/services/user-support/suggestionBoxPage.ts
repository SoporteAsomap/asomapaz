import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import { debugLog, errorLog } from '@/utils/environment';
import type { 
  ISuggestionBoxPageAPIResponse, 
  ISuggestionBoxPageData 
} from '@/interfaces';

export const suggestionBoxPageService = {
  getSuggestionBoxPage: async (): Promise<ISuggestionBoxPageData> => {
    try {
      debugLog('[SuggestionBoxPageService] Fetching suggestion box page data');
      
      const response = await httpClient.get<ISuggestionBoxPageAPIResponse>(
        ENDPOINTS.COLLECTIONS.USER_SUPPORT.SUGGESTION_BOX_PAGE
      );

      debugLog('[SuggestionBoxPageService] API response:', response.data);


      if (!response.data || response.data.length === 0) {
        throw new Error('No suggestion box page data found');
      }

 
      const apiData = response.data[0];

      // if (!response.data.results || response.data.results.length === 0) {
      //   throw new Error('No suggestion box page data found');
      // }

      // const apiData = response.data.results[0];

      // Transformar datos de la API al formato del frontend
      const transformedData: ISuggestionBoxPageData = {
        id: apiData.id,
        title: apiData.title,
        description: apiData.description,
        isActive: apiData.is_active,
        createdAt: apiData.created_at,
        updatedAt: apiData.updated_at
      };

      debugLog('[SuggestionBoxPageService] Transformed data:', transformedData);
      
      return transformedData;

    } catch (error) {
      errorLog('[SuggestionBoxPageService] Error fetching suggestion box page:', error);
      throw error;
    }
  }
};
