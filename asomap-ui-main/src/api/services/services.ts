import { httpClient } from '../config/httpClient';
import { ENDPOINTS } from '@/constants';
import { normalizeMediaUrl } from '@/utils/media';

export const servicesService = {
  getServicesPage: async (): Promise<any | null> => {
    try {
      const response = await httpClient.get<any>(
        ENDPOINTS.COLLECTIONS.SERVICES.MAIN
      );

      const raw = response.data[0];
      const apiData = Array.isArray(raw?.results) ? raw.results[0] : raw;

      if (!apiData) return null;

      return {
        id: apiData.id,
        title: apiData.title || '',
        subtitle: apiData.subtitle || '',
        searchPlaceholder: apiData.search_placeholder || '',
        noResultsText: apiData.no_results_text || '',
        internetBankingUrl: apiData.internet_banking_url || '',
        internetBankingButton: apiData.internet_banking_button || '',
        items: Array.isArray(apiData.items) ? apiData.items : [],
        itemDetails: Array.isArray(apiData.item_details)
          ? apiData.item_details.map((service: any) => ({
              id: service.id,
              title: service.title || '',
              description: service.description || '',
              steps: service.steps || '',
              imageUrl: normalizeMediaUrl(service.image_url),
              imageAlt: service.image_alt || '',
              pdfUrl: normalizeMediaUrl(service.pdf_url),
            }))
          : [],
        isActive: apiData.is_active,
        createdAt: apiData.created_at,
        updatedAt: apiData.updated_at,
      };
    } catch (error) {
      return null;
    }
  },

  getServices: async (): Promise<any | null> => {
    return servicesService.getServicesPage();
  }
};

