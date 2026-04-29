import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import { debugLog, errorLog } from '@/utils/environment';
import type { ISubmitFraudReport } from '@/interfaces';

interface FraudReportResponse {
  message: string;
}

export const fraudReportService = {
  submitFraudReport: async (formData: ISubmitFraudReport): Promise<string> => {
    try {
      debugLog('[FraudReportService] Submitting fraud report:', formData);
      // Crear objeto JSON sin el archivo
      const submitData = {
        classification: formData.classification,
        fullName: formData.fullName,
        document: formData.document,
        phone: formData.phone,
        email: formData.email,
        message: formData.message
        // ❌ NO incluir file aquí - se maneja por separado
      };
      const response = await httpClient.post<FraudReportResponse, Record<string, unknown>>(
        ENDPOINTS.COLLECTIONS.USER_SUPPORT.FRAUD_REPORT,
        submitData
        // Removemos el Content-Type para que se establezca automáticamente con FormData
      );

      debugLog('[FraudReportService] Fraud report submitted successfully:', response.data);
      return response.data.message;

    } catch (error) {
      errorLog('[FraudReportService] Error submitting fraud report:', error);
      throw error;
    }
  }
};

