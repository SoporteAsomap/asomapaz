import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CalculatorModal from './CalculatorModal';
import { FaCalculator } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SideNav: React.FC = () => {
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();
    
    const isLoanPage = location.pathname.startsWith('/productos/prestamos') || location.pathname.startsWith('/productos/prestamo/');

    const isExpanded = isLoanPage || isHovered;

    if (location.pathname === '/locations/map') {
        return null;
    }

    return (
        <>
            <motion.div
                className="fixed left-0 bottom-0 z-30 sm:bottom-2"
                initial={{ x: -32 }}
                animate={{ x: isExpanded ? -12 : -24 }}
                whileHover={{ x: 0 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
                <motion.button
                    type="button"
                    // AQUÍ AUMENTAMOS EL ANCHO: de w-40/w-48 a w-48/w-56 para que el texto quepa bien
                    className={`group relative overflow-hidden rounded-r-2xl p-0 shadow-lg transition-all duration-300 ${
                        isExpanded ? 'h-12 w-52 sm:h-14 sm:w-60' : 'h-10 w-14 sm:h-12 sm:w-16'
                    }`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsCalculatorOpen(true)}
                    aria-label="Abrir calculadora"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-dark transition-all duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tl from-primary-dark via-primary to-primary-dark transition-all duration-500" />
                    <div className="absolute inset-0 bg-black/5 rounded-r-2xl backdrop-blur-[1px]" />

                    {/* Efecto de brillo */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                        <div className="absolute inset-y-0 -inset-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {/* Contenedor del icono */}
                    <div className={`relative flex h-full w-full items-center ${isExpanded ? 'justify-between pl-5 pr-4 sm:pl-6 sm:pr-5' : 'justify-end pr-3 sm:pr-4'}`}>
                        
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span 
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    // Le quitamos el pr-3 para que no empuje el icono y ajustamos un poco el tamaño
                                    className="text-left text-xs font-semibold uppercase tracking-wide text-white sm:text-sm whitespace-nowrap overflow-hidden"
                                >
                                    Calcula tu Préstamo
                                </motion.span>
                            )}
                        </AnimatePresence>

                        <motion.div
                            initial={{ rotate: 0 }}
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10 shrink-0"
                        >
                            <FaCalculator className="w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow-lg transition-transform duration-300 group-hover:scale-110" />
                        </motion.div>
                    </div>
                </motion.button>
            </motion.div>

            <CalculatorModal isOpen={isCalculatorOpen} closeModal={() => setIsCalculatorOpen(false)} />
        </>
    );
};

export default SideNav;