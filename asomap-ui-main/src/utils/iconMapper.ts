import { 
  FaMoneyBillWave, 
  FaCreditCard, 
  FaMobileAlt,
  FaHome,
  FaCar,
  FaGraduationCap,
  FaBuilding,
  FaChartLine,
  FaShieldAlt,
  FaGift,
  FaStar,
  FaHeart,
  FaUsers,
  FaHandshake,
  FaLightbulb,
  FaRocket,
  FaGem,
  FaCrown,
  FaTrophy,
  FaMedal,
  FaUserShield
} from 'react-icons/fa';
import { IconType } from 'react-icons';

// Mapeo de nombres de iconos a componentes
const iconMap: Record<string, IconType> = {
  // Iconos de dinero y finanzas
  FaMoneyBillWave,
  FaCreditCard,
  FaChartLine,
  
  // Iconos de dispositivos
  FaMobileAlt,
  
  // Iconos de préstamos
  FaHome,
  FaCar,
  FaGraduationCap,
  FaBuilding,
  
  // Iconos de beneficios
  FaShieldAlt,
  FaGift,
  FaStar,
  FaHeart,
  FaUsers,
  FaHandshake,
  FaLightbulb,
  FaRocket,
  FaGem,
  FaCrown,
  FaTrophy,
  FaMedal,
  FaUserShield
};

/**
 * Obtiene el componente de icono basado en el nombre
 * @param iconName - Nombre del icono (ej: "FaMoneyBillWave")
 * @returns Componente de icono o un icono por defecto si no se encuentra
 */
export const getIconComponent = (iconName: string): IconType => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) {
    return FaStar; // Icono por defecto
  }
  return IconComponent;
};

/**
 * Verifica si un nombre de icono es válido
 * @param iconName - Nombre del icono a verificar
 * @returns true si el icono existe, false en caso contrario
 */
export const isValidIcon = (iconName: string): boolean => {
  return iconName in iconMap;
};

/**
 * Obtiene la lista de todos los iconos disponibles
 * @returns Array con los nombres de todos los iconos disponibles
 */
export const getAvailableIcons = (): string[] => {
  return Object.keys(iconMap);
};

