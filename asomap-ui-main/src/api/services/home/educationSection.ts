import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import type { IEducationSectionProps } from '@/interfaces';
import { debugLog, errorLog } from '@/utils/environment';
import { normalizeObjectMedia } from '@/utils/media';

export const educationSectionService = {
  getEducationSection: async (): Promise<IEducationSectionProps['data']> => {
    try {
      debugLog('[EducationSectionService] Fetching from backend');
      const response = await httpClient.get<{ data: IEducationSectionProps['data'] }>(
        ENDPOINTS.COLLECTIONS.HOME.EDUCATION_SECTION
      );

      debugLog('[EducationSectionService] Backend response received successfully:', response.data);

      const raw = response.data.data as IEducationSectionProps['data'] & {
        education_items?: IEducationSectionProps['data']['educationItems'];
        footer_text?: IEducationSectionProps['data']['footerText'];
      };
      const mapped = {
        ...raw,
        educationItems: raw.education_items ?? raw.educationItems ?? [],
        footerText: raw.footer_text ?? raw.footerText ?? '',
      };
      return normalizeObjectMedia(mapped);
    } catch (error) {
      errorLog('[EducationSectionService] Error fetching education section data:', error);
      throw error;
    }
  }
};
