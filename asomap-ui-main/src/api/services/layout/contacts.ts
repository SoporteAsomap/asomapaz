import { httpClient } from '@/api';
import { ENDPOINTS } from '@/constants';
import type { IContactData, IContactResponse } from '@/interfaces';

export const contactsService = {
    /**
     * Obtiene todos los contactos activos
     */
    getAllContacts: async (): Promise<IContactResponse> => {
        try {
            const response = await httpClient.get<IContactResponse>(ENDPOINTS.COLLECTIONS.LAYOUT.CONTACTS);
            
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
            throw new Error('Error al obtener los contactos');
        }
    },

    /**
     * Obtiene un contacto específico por ID
     */
    getContactById: async (id: number): Promise<IContactData | null> => {
        try {
            const response = await httpClient.get<IContactData>(`${ENDPOINTS.COLLECTIONS.LAYOUT.CONTACTS}${id}/`);
            
            if (!response) {
                return null;
            }

            return response.data;
        } catch (error) {
            throw new Error('Error al obtener el contacto');
        }
    }
};

