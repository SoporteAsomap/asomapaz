import React, { CSSProperties, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PDFPreviewProps {
  url: string;
  className?: string;
  height?: string;
  showOpenButton?: boolean;
  openButtonPosition?: 'top-right' | 'bottom-right' | 'center';
  customStyles?: CSSProperties;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ 
  url, 
  className = '',
  height = '400px',
  showOpenButton = true,
  openButtonPosition = 'top-right',
  customStyles = {}
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Construimos la URL de previsualización forzando la página 1 y ocultando la barra de herramientas
  const previewUrl = `${url}#page=1&view=FitH&toolbar=0`;

  const styles: { [key: string]: CSSProperties } = {
    container: {
      height,
      ...customStyles
    },
  };

  const getOpenButtonPosition = (): CSSProperties => {
    switch (openButtonPosition) {
      case 'bottom-right':
        return { bottom: '8px', right: '8px' };
      case 'center':
        return { 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)' 
        };
      default:
        return { top: '8px', right: '8px' };
    }
  };

  const handleObjectLoad = () => {
    setIsLoading(false);
    setHasLoaded(true);
    setIsLoadingPreview(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!hasLoaded) {
      setIsLoadingPreview(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Lógica para mostrar el botón: si está cargando (!hasLoaded) o si el mouse está encima
  const shouldShowButton = !hasLoaded || isHovered;

  return (
    <div 
      className={`relative w-full bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 ${className}`}
      style={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {(!hasLoaded || isLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50/80 to-white/90 backdrop-blur-[2px] z-20"
          >
            <div className="w-full max-w-[80%] space-y-2 sm:space-y-3">
              <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full animate-pulse w-3/4"></div>
              <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full animate-pulse w-1/2"></div>
            </div>
          </motion.div>
        )}

        {isLoadingPreview && !hasLoaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50/95 to-white/95 backdrop-blur-[2px] z-30"
          >
            <div className="relative w-8 h-8 sm:w-10 sm:h-10">
              <div className="absolute w-full h-full border-2 sm:border-3 border-[#2B4BA9]/20 rounded-full"></div>
              <div className="absolute w-full h-full border-2 sm:border-3 border-[#2B4BA9] rounded-full animate-spin border-t-transparent"></div>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-gray-500 font-medium">
              Cargando PDF...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {showOpenButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: shouldShowButton ? 1 : 0,
            scale: shouldShowButton ? 1 : 0.9,
          }}
          transition={{ duration: 0.2 }}
          // Al hacer clic, enviamos a la URL original para que vean el PDF completo
          onClick={() => window.open(url, '_blank')}
          // Se cambió el z-10 por z-40 para que se pueda clickear por encima de la pantalla de carga
          className="absolute p-1.5 sm:p-2.5 bg-white hover:bg-[#2B4BA9] text-[#2B4BA9] hover:text-white rounded-lg shadow-lg backdrop-blur-[2px] z-10 transition-all duration-300"
          style={getOpenButtonPosition()}
          title="Abrir documento completo"
        >
          <svg 
            className="w-4 h-4 sm:w-5 sm:h-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
            />
          </svg>
        </motion.button>
      )}

      <div className="w-full h-full overflow-hidden bg-gradient-to-br from-gray-50/30 to-white/30">
        {(isHovered || hasLoaded) && (
          <object
            data={previewUrl}
            type="application/pdf"
            className="w-full h-full"
            onLoad={handleObjectLoad}
          >
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Tu navegador no soporta la previsualización directa de PDFs.
              </p>
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-4 py-2 bg-[#2B4BA9] text-white rounded-lg hover:bg-blue-800 transition-colors text-sm sm:text-base font-medium shadow-sm"
              >
                Descargar Memoria
              </a>
            </div>
          </object>
        )}
      </div>
    </div>
  );
};