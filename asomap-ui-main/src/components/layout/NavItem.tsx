import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronDown } from 'react-icons/fi';
import { NavItemProps, SubNavItem, MainNavItem } from '@interfaces';

export const NavItem: React.FC<NavItemProps> = ({
    text,
    to,
    hasDropdown,
    icon,
    dropdownItems,
    onLinkClick,
    className,
    isExternalLink
}) => {
    const [activeItem, setActiveItem] = useState<MainNavItem | null>(null);
    const [activeSubItem, setActiveSubItem] = useState<SubNavItem | null>(null);
    const [dropdownOffset, setDropdownOffset] = useState(0);
    const [pointerOffset, setPointerOffset] = useState(0);
    
    // 🔥 NUEVO ESTADO: Controla si se acaba de hacer clic para forzar el cierre
    const [isClicked, setIsClicked] = useState(false); 
    
    const navItemRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const hasSubMenu = activeItem && activeItem.text !== "Servicios" && activeItem.subItems && activeItem.subItems.length > 0;

    useEffect(() => {
        const navItem = navItemRef.current;
        if (!navItem) return;

        const updatePosition = () => {
            const rect = navItem.getBoundingClientRect();
            const dropdownWidth = hasSubMenu ? 800 : 300;
            const viewportWidth = window.innerWidth;

            const elementCenter = rect.left + (rect.width / 2);
            let dropdownLeft = elementCenter - (dropdownWidth / 2);

            if (dropdownLeft < 20) {
                dropdownLeft = 20; 
            } else if (dropdownLeft + dropdownWidth > viewportWidth - 20) {
                dropdownLeft = viewportWidth - dropdownWidth - 20; 
            }

            setDropdownOffset(dropdownLeft);
            const arrowPosition = elementCenter - dropdownLeft;
            setPointerOffset(arrowPosition);
        };

        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [hasSubMenu]);

    useEffect(() => {
        if (dropdownItems && dropdownItems.length > 0) {
            setActiveItem(dropdownItems[0]);
            if (dropdownItems[0].subItems && dropdownItems[0].subItems.length > 0) {
                setActiveSubItem(dropdownItems[0].subItems[0]);
            }
        }
    }, [dropdownItems]);

    const handleNavigation = (href: string, external?: boolean) => {
        if (!href) return;


        setIsClicked(true);
    

        if (onLinkClick) onLinkClick();

        if (external) {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            navigate(href);
        }
    };

    const renderContent = () => (
        <>
            {icon && <span className="mr-2">{icon}</span>}
            <span>{text}</span>
            {hasDropdown && <FiChevronDown className="w-4 h-4 ml-1 group-hover:text-primary-accent" />}
        </>
    );

    return (
        <div
            ref={navItemRef}
            className={`relative group ${className}`}
            // Si el usuario saca el mouse, aseguramos resetear el estado
            onMouseLeave={() => setIsClicked(false)} 
        >
            {to ? (
                isExternalLink ? (
                   <a
                        href={to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center cursor-pointer text-neutral-200 hover:text-primary-accent"
                        onClick={() => {
                            setIsClicked(true);
                            
                            if (onLinkClick) onLinkClick();
                        }}
                    >
                        {renderContent()}
                    </a>
                ) : (
                    <div
                        className="flex items-center cursor-pointer text-neutral-200 hover:text-primary-accent"
                        onClick={() => handleNavigation(to, false)}
                    >
                        {renderContent()}
                    </div>
                )
            ) : (
                <div className="flex items-center cursor-pointer text-neutral-200 hover:text-primary-accent">
                    {renderContent()}
                </div>
            )}
            
            {hasDropdown && dropdownItems && dropdownItems.length > 0 && (
                <div className="fixed w-screen h-screen top-0 left-0 pointer-events-none">
                    <div
                        // 🔥 AQUÍ SE APLICA EL EFECTO: Si está clickeado, quitamos las clases de hover temporalmente
                        className={`absolute mt-2 rounded-lg shadow-lg opacity-0 invisible transition-all duration-300 bg-white pointer-events-auto ${
                            !isClicked ? 'group-hover:opacity-100 group-hover:visible' : ''
                        } ${hasSubMenu ? 'w-[890px]' : 'w-[340px]'}`}
                        style={{
                            top: navItemRef.current?.getBoundingClientRect()?.bottom ?? 0 + 4,
                            left: dropdownOffset ? `${dropdownOffset}px` : '0'
                        }}
                    >
                        <div className="relative">
                            <div
                                className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-white -top-1.5"
                                style={{
                                    left: `${pointerOffset}px`,
                                    transform: 'translateX(-50%)'
                                }}
                            />
                            <div className="relative bg-white rounded-lg p-6">
                                <div className={`flex ${!hasSubMenu ? 'flex-col' : ''}`}>
                                    <div className={`${hasSubMenu ? 'w-1/3 pr-4 border-r border-secondary-light' : 'w-full'} space-y-3`}>
                                        {dropdownItems.map((item, index) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center w-full p-2.5 space-x-3 rounded-lg cursor-pointer text-neutral-100 hover:bg-secondary hover:text-neutral-100 transition-colors duration-200 bg-secondary-light"
                                                    onMouseEnter={() => {
                                                        setActiveItem(item);
                                                        if (item.subItems && item.subItems.length > 0) {
                                                            setActiveSubItem(item.subItems[0]);
                                                        } else {
                                                            setActiveSubItem(null);
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        if (item.to) {
                                                            // Usamos la nueva función
                                                            handleNavigation(item.to, item.isExternalLink);
                                                        }
                                                    }}
                                                >
                                                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                                                    <span className="text-sm truncate">{item.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {hasSubMenu && (
                                        <>
                                            <div className={`w-1/3 px-4 py-2 ${activeItem?.text === "Productos" ? 'max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent' : ''}`}>
                                                <div className={`space-y-2 ${activeItem?.text === "Productos" ? 'pr-2' : ''}`}>
                                                    {activeItem?.subItems?.map((subItem, index) => (
                                                        <span
                                                            key={index}
                                                            className="block p-2.5 rounded-md text-sm text-neutral-200 hover:bg-secondary cursor-pointer transition-colors duration-200"
                                                            onMouseEnter={() => setActiveSubItem(subItem)}
                                                            onClick={() => handleNavigation(subItem.href, false)}
                                                        >
                                                            {subItem.text}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-1/3 p-4 rounded-lg bg-white">
                                                {activeSubItem ? (
                                                    <>
                                                        <h3 className="mb-3 text-sm text-gray-900">{activeSubItem.text}</h3>
                                                        <div className="flex justify-center mb-4">
                                                            <img src={activeSubItem.image} alt={activeSubItem.text} className="w-full h-36 rounded-lg object-cover" />
                                                        </div>
                                                        <button
                                                            onClick={() => handleNavigation(activeSubItem.href, false)}
                                                            className="block w-full px-3 py-2 text-sm text-center text-white transition-colors duration-300 rounded-md bg-primary hover:bg-primary-accent"
                                                        >
                                                            Más información
                                                        </button>
                                                    </>
                                                ) : activeItem ? (
                                                    <>
                                                        <h3 className="mb-3 text-sm text-neutral-100">{activeItem.text}</h3>
                                                        <div className="flex justify-center mb-4">
                                                            <img src={activeItem.image} alt={activeItem.text} className="w-full h-36 rounded-lg object-cover" />
                                                        </div>
                                                        <button
                                                            onClick={() => activeItem.to ? handleNavigation(activeItem.to, activeItem.isExternalLink) : null}
                                                            className="block w-full px-3 py-2 text-sm text-center text-white transition-colors duration-300 rounded-md bg-primary hover:bg-primary-accent"
                                                        >
                                                            {activeItem.to ? 'Ver todos' : 'Solicítalo!'}
                                                        </button>
                                                    </>
                                                ) : null}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};