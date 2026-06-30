import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NavbarProps } from '@interfaces';
import { NavItem } from './NavItem';
import { SearchBar } from './SearchBar';
import { MenuToggle } from './MenuToggle';
import { MobileMenu } from './MobileMenu';
import { Button } from '@components/ui';
import Logo from '@assets/Logo.svg';
import { IoLocationOutline } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { menuItems, buttonLink } from '@mocks';

export const SimpleNavItem: React.FC<{ text: string; to: string; className?: string }> = ({ text, to, className }) => (
  <Link
    to={to}
    className={`flex items-center cursor-pointer transition-colors duration-200 ${className}`}
  >
    <span>{text}</span>
  </Link>
);

export const Navbar: React.FC<NavbarProps> = ({
  isMenuOpen,
  setIsMenuOpen,
  aboutItems = menuItems.aboutItems,
  productItems = menuItems.productItems,
  newsItems,
  financialGuidanceItems = menuItems.financialGuidanceItems,
  userSupportItems,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handlePaymentClick = () => {
    window.open(buttonLink.appLink, '_blank', 'noopener,noreferrer');
  };

  // Estilo base para los links del menú de escritorio para evitar repetición
  // Incluye 'whitespace-nowrap' para evitar saltos de línea y un efecto de subrayado animado
  const navItemClassName = "text-gray-700 hover:text-primary font-semibold text-[13px] xl:text-[14px] whitespace-nowrap transition-colors duration-200 px-2 xl:px-3 py-2 relative block after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300";

  return (
    <>
      <nav className="fixed top-[32px] left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 h-[68px] transition-all duration-300">
        <div className="container mx-auto px-4 max-w-7xl h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center flex-shrink-0"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            aria-label="Asomap Logo - Ir a inicio"
          >
            <img
              src={Logo}
              alt="Asomap Logo"
              className="w-[105px] h-[32px] sm:w-[120px] sm:h-[34px] lg:w-[135px] lg:h-[36px] transition-transform duration-200 hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Menu - Mejorado con flex-grow para aprovechar todo el espacio horizontal */}
          <div className="hidden lg:flex flex-grow justify-center mx-4">
            <div className="flex items-center space-x-1 xl:space-x-2 max-w-full overflow-x-auto no-scrollbar">
              <NavItem
                text="Sobre Nosotros"
                hasDropdown
                dropdownItems={aboutItems}
                onLinkClick={() => { }}
                className={navItemClassName}
              />
              <NavItem
                text="Productos"
                hasDropdown
                dropdownItems={productItems}
                onLinkClick={() => { }}
                className={navItemClassName}
              />
              <SimpleNavItem
                text="Servicios"
                to="/servicios"
                className={navItemClassName}
              />
              <NavItem
                text="Novedades"
                hasDropdown
                dropdownItems={newsItems}
                onLinkClick={() => { }}
                className={navItemClassName}
              />
              <NavItem
                text="Orientación Financiera"
                hasDropdown
                dropdownItems={financialGuidanceItems}
                onLinkClick={() => { }}
                className={navItemClassName}
              />
              <NavItem
                text="Prousuario"
                hasDropdown
                dropdownItems={userSupportItems.map(item => ({
                  ...item,
                  isExternalLink: item.isExternalLink
                }))}
                onLinkClick={() => { }}
                className={navItemClassName}
              />
            </div>
          </div>

          {/* Desktop Action Buttons - flex-shrink-0 evita que los botones se achiquen */}
          <div className="hidden lg:flex items-center flex-shrink-0 space-x-3 pl-2">
            <div className="w-[180px] xl:w-[200px] flex justify-end">
              <SearchBar
                isOpen={isSearchOpen}
                onToggle={() => setIsSearchOpen(!isSearchOpen)}
                isMobile={false}
                className="w-full"
              />
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-shrink-0">
              <Button
                className="px-4 xl:px-5 py-2 text-xs xl:text-sm font-bold text-white bg-[#F58220] hover:bg-[#e0751a] rounded-full transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
                onClick={handlePaymentClick}
              >
                Asomap Banking
              </Button>
            </motion.div>

            <Link
              to="/locations/map"
              className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-primary transition-colors rounded-full hover:bg-gray-100 flex-shrink-0"
              title="Sucursales"
            >
              <IoLocationOutline className="w-5 h-5 xl:w-6 xl:h-6" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 lg:hidden">
            <SearchBar
              isOpen={isSearchOpen}
              onToggle={() => setIsSearchOpen(!isSearchOpen)}
              isMobile={true}
              className="scale-90"
            />
            <motion.div whileTap={{ scale: 0.95 }}>
              <MenuToggle
                isOpen={isMenuOpen}
                onToggle={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary transition-colors duration-200"
              />
            </motion.div>
          </div>
        </div>
      </nav>
      
      {/* Spacer */}
      <div className="h-[100px]" />
      
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        aboutItems={aboutItems}
        productItems={productItems}
        newsItems={newsItems}
        financialGuidanceItems={financialGuidanceItems}
        userSupportItems={userSupportItems}
        buttonLink={buttonLink}
      />
    </>
  );
};