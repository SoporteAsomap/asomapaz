import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import type { IBannerAPI, IBannerDataAPI } from '@/interfaces';

export const bannerService = {
  /**
   * Obtiene el banner principal activo
   */
  async getMainBanner(): Promise<IBannerDataAPI | null> {
    try {
      const response = await httpClient.get<IBannerAPI>(`${ENDPOINTS.COLLECTIONS.PRODUCTS.BANNERS}main/`);
      
      if (!response) {
        return null;
      }

      return {
        id: response.data.id,
        title: response.data.title,
        description: response.data.description,
        button1Name: response.data.button1_name,
        button1Url: response.data.button1_url,
        button2Name: response.data.button2_name,
        button2Url: response.data.button2_url,
        isActive: response.data.is_active,
        order: response.data.order,
        slug: response.data.slug,
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Obtiene todos los banners activos
   */
  async getAllBanners(): Promise<IBannerDataAPI[]> {
    try {
      const response = await httpClient.get<IBannerAPI[]>(ENDPOINTS.COLLECTIONS.PRODUCTS.BANNERS);
      
      if (!response || !Array.isArray(response)) {
        return [];
      }

      return response.data.map(banner => ({
        id: banner.id,
        title: banner.title,
        description: banner.description,
        button1Name: banner.button1_name,
        button1Url: banner.button1_url,
        button2Name: banner.button2_name,
        button2Url: banner.button2_url,
        isActive: banner.is_active,
        order: banner.order,
        slug: banner.slug,
      }));
    } catch (error) {
      return [];
    }
  }
};
