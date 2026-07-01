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

      // Convertimos a array seguro para evitar el error de "length" y el índice "0"
      const rawData: any[] = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.data || (response.data as any)?.results || [response.data];

      if (!rawData || rawData.length === 0) {
        throw new Error('No rights and duties data found');
      }

      // Tomamos directamente el primer elemento del array seguro
      const apiData = rawData[0];

      // Transformar datos de la API al formato del frontend
      const transformedData: IRightsAndDutiesData = {
        pageTitle: apiData.pageTitle,
        pageDescription: apiData.pageDescription,
        // Agregamos : any al map de section
        sections: apiData.sections.map((section: any) => ({
          id: section.id,
          title: section.title,
          description: section.description,
          buttonText: section.button_text,
          additionalInfo: section.additional_info,
          // Agregamos : any al map de image
          images: section.images.map((image: any) => ({
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