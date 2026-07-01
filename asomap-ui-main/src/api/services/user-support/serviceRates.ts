import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import { debugLog, errorLog } from '@/utils/environment';
import type { 
  IServiceRatesAPIResponse, 
  IServiceRatesData,
  IServiceCategoryAPIResponse,
  IServiceCategoryData
} from '@/interfaces';

export const serviceRatesService = {
  getServiceRates: async (): Promise<IServiceRatesData> => {
    try {
      debugLog('[ServiceRatesService] Fetching service rates data');
      
      const response = await httpClient.get<IServiceRatesAPIResponse>(
        ENDPOINTS.COLLECTIONS.USER_SUPPORT.SERVICE_RATES
      );

      debugLog('[ServiceRatesService] API response:', response.data);

      // Extracción segura del arreglo
      const rawData: any[] = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.data || (response.data as any)?.results || [response.data];

      if (!rawData || rawData.length === 0) {
        throw new Error('No service rates data found');
      }
      
      // Tomamos el primer elemento del arreglo seguro
      const apiData = rawData[0];

      // Transformar datos de la API al formato del frontend
      const transformedData: IServiceRatesData = {
        title: apiData.title,
        description: apiData.description,
        // Agregamos : any a category
        categories: apiData.categories.map((category: any) => ({
          id: category.id,
          name: category.name,
          // Agregamos : any a rate
          rates: category.rates.map((rate: any) => ({
            id: rate.id,
            service: rate.service,
            description: rate.description,
            rate: rate.rate,
            details: rate.details // Mantener HTML content
          }))
        }))
      };

      debugLog('[ServiceRatesService] Transformed data:', transformedData);
      
      return transformedData;

    } catch (error) {
      errorLog('[ServiceRatesService] Error fetching service rates:', error);
      throw error;
    }
  },

  getServiceCategories: async (): Promise<IServiceCategoryData[]> => {
    try {
      debugLog('[ServiceRatesService] Fetching service categories data');
      
      const response = await httpClient.get<IServiceCategoryAPIResponse>(
        ENDPOINTS.COLLECTIONS.USER_SUPPORT.SERVICE_CATEGORIES
      );

      debugLog('[ServiceRatesService] Categories API response:', response.data);

      // Extracción segura del arreglo para categories
      const rawData: any[] = Array.isArray(response.data) 
        ? response.data 
        : (response.data as any)?.results || (response.data as any)?.data || [];

      if (!rawData || rawData.length === 0) {
        throw new Error('No service categories data found');
      }

      // Transformar datos de la API al formato del frontend
      const transformedData: IServiceCategoryData[] = rawData.map((category: any) => ({
        id: category.id,
        name: category.name,
        // Agregamos : any a rate
        rates: category.rates.map((rate: any) => ({
          id: rate.id,
          service: rate.service,
          description: rate.description,
          rate: rate.rate,
          details: rate.details // Mantener HTML content
        }))
      }));

      debugLog('[ServiceRatesService] Transformed categories data:', transformedData);
      
      return transformedData;

    } catch (error) {
      errorLog('[ServiceRatesService] Error fetching service categories:', error);
      throw error;
    }
  }
};