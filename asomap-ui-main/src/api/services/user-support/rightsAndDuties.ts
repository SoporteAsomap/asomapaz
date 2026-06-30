import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import { debugLog, errorLog } from '@/utils/environment';
import type { 
  IRightsAndDutiesAPIResponse, 
  IRightsAndDutiesData 
} from '@/interfaces';

export const rightsAndDutiesService = {
  getRightsAndDuties: async (): Promise<IRightsAndDutiesData> => {
    try {
      debugLog('[RightsAndDutiesService] Fetching rights and duties data');
      
      const response = await httpClient.get<IRightsAndDutiesAPIResponse>(
        ENDPOINTS.COLLECTIONS.USER_SUPPORT.RIGHTS_AND_DUTIES
      );

      debugLog('[RightsAndDutiesService] API response:', response.data);

      if (!response.data || response.data.length === 0) {
        throw new Error('No rights and duties data found');
      }

      // Tomamos directamente el primer elemento del array que nos manda Django
      const apiData = response.data[0];

      // if (!response.data.results || response.data.results.length === 0) {
      //   throw new Error('No rights and duties data found');
      // }

      // const apiData = response.data.results[0];

      // Transformar datos de la API al formato del frontend
      const transformedData: IRightsAndDutiesData = {
        pageTitle: apiData.pageTitle,
        pageDescription: apiData.pageDescription,
        sections: apiData.sections.map(section => ({
          id: section.id,
          title: section.title,
          description: section.description,
          buttonText: section.button_text,
          additionalInfo: section.additional_info,
          images: section.images.map(image => ({
            id: image.id,
            src: image.src,
            alt: image.alt_text,
            description: image.description
          }))
        }))
      };

      debugLog('[RightsAndDutiesService] Transformed data:', transformedData);
      
      return transformedData;

    } catch (error) {
      errorLog('[RightsAndDutiesService] Error fetching rights and duties:', error);
      throw error;
    }
  }
};
