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

      // if (!response.data.results || response.data.results.length === 0) {
      //   throw new Error('No service rates data found');
      // }

      // const apiData = response.data.results[0];

      if (!response.data || response.data.length === 0) {
        throw new Error('No service rates data found');
      }
      const apiData = response.data[0];

      // Transformar datos de la API al formato del frontend
      const transformedData: IServiceRatesData = {
        title: apiData.title,
        description: apiData.description,
        categories: apiData.categories.map(category => ({
          id: category.id,
          name: category.name,
          rates: category.rates.map(rate => ({
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

      if (!response.data.results || response.data.results.length === 0) {
        throw new Error('No service categories data found');
      }

      // Transformar datos de la API al formato del frontend
      const transformedData: IServiceCategoryData[] = response.data.results.map(category => ({
        id: category.id,
        name: category.name,
        rates: category.rates.map(rate => ({
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
