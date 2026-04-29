import { httpClient } from '../../config/httpClient';
import { API_CONFIG } from '../../config/config';
import { ENDPOINTS } from '@/constants';
import { debugLog, errorLog } from '@/utils/environment';
import type { 
  ISavingTipsAPIResponse, 
  ISavingTipData,
  ISliderSlidesAPIResponse,
  ISliderSlideData,
  IFAQAPIResponse,
  IFAQItemData,
  ISavingTipsPageData
} from '@/interfaces';

export const savingTipsService = {
  getAllSavingTips: async (): Promise<ISavingTipData[]> => {
    try {
      debugLog('[SavingTipsService] Fetching all saving tips');
      
      const response = await httpClient.get<ISavingTipsAPIResponse>(ENDPOINTS.COLLECTIONS.FINANCIAL_GUIDANCE.SAVING_TIPS);
      
      // Filtrar solo consejos activos y transformar datos
      const tips: ISavingTipData[] = response.data.results
        .filter(tip => tip.is_active)
        .sort((a, b) => a.order - b.order)
        .map(tip => ({
          id: tip.id,
          title: tip.title,
          description: tip.description,
          content: tip.content,
          link: tip.link,
          order: tip.order
        }));

      debugLog('[SavingTipsService] Saving tips fetched successfully:', tips);
      return tips;

    } catch (error) {
      errorLog('[SavingTipsService] Error fetching saving tips:', error);
      throw error;
    }
  },

  getSliderSlides: async (): Promise<ISliderSlideData[]> => {
    try {
      debugLog('[SavingTipsService] Fetching slider slides');
      
      const response = await httpClient.get<ISliderSlidesAPIResponse>(ENDPOINTS.COLLECTIONS.FINANCIAL_GUIDANCE.SLIDER_SLIDES);
      
      // Filtrar solo slides activos y transformar datos
      const slides: ISliderSlideData[] = response.data.results
        .filter(slide => slide.is_active)
        .sort((a, b) => a.order - b.order)
        .map(slide => ({
          id: slide.id,
          image: slide.image_url || null, // Validación simple: null si no hay imagen
          title: slide.title,
          description: slide.description
        }));

      debugLog('[SavingTipsService] Slider slides fetched successfully:', slides);
      return slides;

    } catch (error) {
      errorLog('[SavingTipsService] Error fetching slider slides:', error);
      throw error;
    }
  },

  getFAQItems: async (): Promise<IFAQItemData[]> => {
    try {
      debugLog('[SavingTipsService] Fetching FAQ items');
      
      const response = await httpClient.get<IFAQAPIResponse>(ENDPOINTS.COLLECTIONS.FINANCIAL_GUIDANCE.FAQ);
      
      // Filtrar solo FAQ activos y transformar datos
      const faqItems: IFAQItemData[] = response.data.results
        .filter(item => item.is_active)
        .sort((a, b) => a.order - b.order)
        .map(item => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          order: item.order
        }));

      debugLog('[SavingTipsService] FAQ items fetched successfully:', faqItems);
      
      // Si no hay datos del backend, retornar datos por defecto en desarrollo
      if (faqItems.length === 0 && API_CONFIG.IS_DEVELOPMENT) {
        return [
          {
            id: 1,
            question: "¿Qué es la educación financiera?",
            answer: "Es el conocimiento necesario para entender cómo funciona el dinero en el mundo: cómo obtenerlo, manejarlo, invertirlo y donarlo.",
            order: 1
          },
          {
            id: 2,
            question: "¿Por qué es importante ahorrar?",
            answer: "Ahorrar te permite estar preparado para imprevistos y alcanzar tus metas financieras.",
            order: 2
          },
          {
            id: 3,
            question: "¿Qué es un fondo de emergencia?",
            answer: "Es un ahorro destinado a cubrir gastos inesperados, como reparaciones o emergencias médicas.",
            order: 3
          },
          {
            id: 4,
            question: "¿Cuánto debo ahorrar?",
            answer: "Un buen objetivo es ahorrar al menos el 20% de tus ingresos mensuales.",
            order: 4
          },
          {
            id: 5,
            question: "¿Qué es invertir?",
            answer: "Invertir es usar tu dinero para comprar activos que generen un retorno, como acciones o bienes raíces.",
            order: 5
          }
        ];
      }
      
      return faqItems;

    } catch (error) {
      errorLog('[SavingTipsService] Error fetching FAQ items:', error);
      throw error;
    }
  },

  getSavingTipsPageData: async (): Promise<ISavingTipsPageData> => {
    try {
      debugLog('[SavingTipsService] Fetching complete saving tips page data');
      
      const [tips, sliderSlides, faqItems] = await Promise.all([
        savingTipsService.getAllSavingTips(),
        savingTipsService.getSliderSlides(),
        savingTipsService.getFAQItems()
      ]);

      const pageData: ISavingTipsPageData = {
        tips,
        sliderSlides,
        faqItems,
        pageTitle: "Consejos de Ahorro",
        pageDescription: "Aquí algunos consejos esenciales para mejorar tus finanzas personales."
      };

      debugLog('[SavingTipsService] Complete page data fetched successfully:', pageData);
      return pageData;

    } catch (error) {
      errorLog('[SavingTipsService] Error fetching complete page data:', error);
      throw error;
    }
  }
};

