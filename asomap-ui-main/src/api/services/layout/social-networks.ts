import { httpClient } from '@/api';
import { ENDPOINTS } from '@/constants';
import type { ISocialNetworkData, ISocialNetworkResponse } from '@/interfaces';

export const socialNetworksService = {
    /**
     * Obtiene todas las redes sociales activas
     */
    getAllSocialNetworks: async (): Promise<ISocialNetworkResponse> => {
        try {
            const response = await httpClient.get<ISocialNetworkResponse>(ENDPOINTS.COLLECTIONS.LAYOUT.SOCIAL_NETWORKS);
            
            if (!response.data || !response.data.results) {
                return {
                    count: 0,
                    next: null,
                    previous: null,
                    results: []
                };
            }

            return {
                count: response.data.count,
                next: response.data.next,
                previous: response.data.previous,
                results: response.data.results
            };
        } catch (error) {
            throw new Error('Error al obtener las redes sociales');
        }
    },

    /**
     * Obtiene una red social específica por ID
     */
    getSocialNetworkById: async (id: number): Promise<ISocialNetworkData | null> => {
        try {
            const response = await httpClient.get<ISocialNetworkData>(`${ENDPOINTS.COLLECTIONS.LAYOUT.SOCIAL_NETWORKS}${id}/`);
            
            if (!response) {
                return null;
            }

            return response.data;
        } catch (error) {
            throw new Error('Error al obtener la red social');
        }
    }
};

