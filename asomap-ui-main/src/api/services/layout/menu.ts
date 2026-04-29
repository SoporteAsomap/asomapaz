import { httpClient } from '../../config/httpClient';
import { ENDPOINTS } from '@/constants';
import { accountsService } from '../products/accounts';
import { loansService } from '../products/loans';
import { cardsService } from '../products/cards';
import { certificatesService } from '../products/certificates';
import { normalizeMediaUrl } from '@/utils/media';

export type MenuAccountItem = {
  text: string;
  href: string;
  image: string;
  category: string;
};

export type MenuSection = {
  title: string;
  items: MenuAccountItem[];
};

export const menuService = {
  getProductMenuItems: async (): Promise<MenuSection[]> => {
    try {
      const accounts = await accountsService.getAllAccounts();
      const loans = await loansService.getAllLoans();
      const cards = await cardsService.getAllCards();
      const certificates = await certificatesService.getAllCertificates();

      const accountsMenuItems: MenuAccountItem[] = accounts.map((account: any) => ({
        text: account.title,
        href: `/productos/cuenta/${account.slug}`,
        image: normalizeMediaUrl(account.bannerImage || account.accountImage || account.image || ''),
        category: String(account.category || ''),
      }));

      const loansMenuItems: MenuAccountItem[] = loans.map((loan: any) => ({
        text: loan.title,
        href: `/productos/prestamo/${loan.slug}`,
        image: normalizeMediaUrl(loan.bannerImage || loan.image || ''),
        category: String(loan.loanType || ''),
      }));

      const cardsMenuItems: MenuAccountItem[] = cards.map((card: any) => ({
        text: card.title,
        href: `/productos/tarjeta/${card.slug}`,
        image: normalizeMediaUrl(card.bannerImage || card.cardImage || card.image || ''),
        category: String(card.cardType || ''),
      }));

      const certificatesMenuItems: MenuAccountItem[] = certificates.map((certificate: any) => ({
        text: certificate.title,
        href: `/productos/certificado/${certificate.slug}`,
        image: normalizeMediaUrl(
          certificate.bannerImage || certificate.certificateImage || certificate.image || ''
        ),
        category: String(certificate.certificateType || ''),
      }));

      return [
        {
          title: 'Cuentas',
          items: accountsMenuItems,
        },
        {
          title: 'Préstamos',
          items: loansMenuItems,
        },
        {
          title: 'Tarjetas',
          items: cardsMenuItems,
        },
        {
          title: 'Certificados',
          items: certificatesMenuItems,
        },
      ];
    } catch (error) {
      return [];
    }
  },

  getMenu: async (): Promise<any | null> => {
    try {
      const response = await httpClient.get<any>(ENDPOINTS.COLLECTIONS.LAYOUT.MENU);
      const apiData = response.data;
      const productSections = await menuService.getProductMenuItems();

      return {
        ...apiData,
        dynamicProducts: productSections,
      };
    } catch (error) {
      return null;
    }
  }
};

