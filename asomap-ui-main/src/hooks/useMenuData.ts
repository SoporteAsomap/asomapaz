import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaWallet, FaHandHoldingUsd, FaCreditCard, FaCertificate, FaCircle } from 'react-icons/fa';
import { menuService } from '@/api/services/layout/menu';

export type MenuSubItem = {
  text: string;
  href: string;
  image: string;
  category: string;
};

export type MenuSectionWithIcons = {
  text: string;
  icon: IconType;
  subItems: MenuSubItem[];
  image: string;
};

const getIconBySection = (title: string): IconType => {
  const normalized = title.toLowerCase();

  if (normalized.includes('cuenta')) return FaWallet;
  if (normalized.includes('préstamo') || normalized.includes('prestamo')) return FaHandHoldingUsd;
  if (normalized.includes('tarjeta')) return FaCreditCard;
  if (normalized.includes('certificado')) return FaCertificate;

  return FaCircle;
};

export const useMenuData = () => {
  const [menuData, setMenuData] = useState<MenuSectionWithIcons[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError(null);

        const menuSections = await menuService.getProductMenuItems();

        const normalizedMenu: MenuSectionWithIcons[] = menuSections.map((section: any) => ({
          text: section.title || '',
          icon: getIconBySection(section.title || ''),
          subItems: Array.isArray(section.items)
            ? section.items.map((item: any) => ({
                text: item.text || '',
                href: item.href || '#',
                image: item.image || '',
                category: String(item.category || ''),
              }))
            : [],
          image:
            Array.isArray(section.items) && section.items.length > 0
              ? section.items[0].image || ''
              : '',
        }));

        setMenuData(normalizedMenu);
      } catch (err) {
        setError('No se pudo cargar el menú');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return {
    menuData,
    loading,
    error,
  };
};

export default useMenuData;

