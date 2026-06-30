import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { IPromotionSlide } from '@/interfaces/promotions.interface';

interface DynamicPromotionBannerProps {
  promotions: IPromotionSlide[];
  autoSlideInterval?: number; // en milisegundos
}

const DynamicPromotionBanner: React.FC<DynamicPromotionBannerProps> = ({ 
  promotions, 
  autoSlideInterval = 4000 // 4 segundos por defecto
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (promotions.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === promotions.length - 1 ? 0 : prevIndex + 1
      );
    }, autoSlideInterval);

    return () => clearInterval(interval);
  }, [promotions.length, autoSlideInterval]);

  if (!promotions || promotions.length === 0) {
    return (
      <div className="relative h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] -mt-[80px] overflow-hidden bg-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-xl">No hay promociones disponibles</p>
        </div>
      </div>
    );
  }

  const currentPromotion = promotions[currentIndex];

  return (
    <div className="relative h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] -mt-[80px] overflow-hidden">
      {/* Imagen de fondo */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentPromotion.id}
          src={currentPromotion.image}
          alt={currentPromotion.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Overlay gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* Contenido del banner */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPromotion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Categoría */}
            {currentPromotion.category && (
              <span className="inline-block bg-primary px-3 py-1 rounded-full text-sm mb-4 font-medium">
                {currentPromotion.category}
              </span>
            )}

            {/* Título */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
              {currentPromotion.title}
            </h1>

            {/* Descripción */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 mb-4 max-w-2xl line-clamp-2">
              {currentPromotion.description}
            </p>

            {/* Meta información */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              {currentPromotion.date && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {currentPromotion.date}
                </span>
              )}
              {currentPromotion.validUntil && (
                <span className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Válido hasta: {currentPromotion.validUntil}
                </span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Indicadores de navegación */}
      {promotions.length > 1 && (
        <div className="absolute bottom-6 right-6 flex gap-2">
          {promotions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a promoción ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Botones de navegación */}
      {promotions.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(prev => prev === 0 ? promotions.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Promoción anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex(prev => prev === promotions.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
            aria-label="Siguiente promoción"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Contador de promociones */}
      {promotions.length > 1 && (
        <div className="absolute top-6 right-6 bg-black/30 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentIndex + 1} / {promotions.length}
        </div>
      )}
    </div>
  );
};

export default DynamicPromotionBanner;
