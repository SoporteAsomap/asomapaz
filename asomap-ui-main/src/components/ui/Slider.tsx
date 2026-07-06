import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { ICarousel } from '@interfaces';

const NavigationButton: React.FC<{ direction: 'prev' | 'next'; onClick: () => void }> = ({ direction, onClick }) => {
  const Icon = direction === 'prev' ? IoChevronBackOutline : IoChevronForwardOutline;

  return (
    <button type="button" onClick={onClick} className={`absolute z-10 p-1.5 sm:p-2 md:p-3 transition-all duration-300 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full top-1/2 ${direction === 'prev' ? 'left-2 sm:left-4 lg:left-8' : 'right-2 sm:right-4 lg:right-8'} hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50`} aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} slide`}>
      <Icon className="w-4 h-4 text-white sm:w-5 sm:h-5 md:w-6 md:h-6" />
    </button>
  );
};

export const Slider: React.FC<ICarousel& { height?: string }> = ({
  autoSlide = false,
  autoSlideInterval = 5000,
  slides = [],
  fullScreen = true,
  className = '',
  height,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const safeSlides = useMemo(() => {
    return Array.isArray(slides)
      ? slides.filter((slide) => slide?.image || slide?.imageTablet || slide?.imageMobile)
      : [];
  }, [slides]);

  const [dimensions, setDimensions] = useState({
    heightClass: 'h-screen',
    aspectRatio: 'aspect-[21/9]',
  });

  const updateDimensions = useCallback(() => {
    // NUEVA LÓGICA: Si enviaste una altura desde Home, úsala y sal de aquí
    if (height) {
      setDimensions(prev => ({ ...prev, heightClass: height }));
      return;
    }

    const windowWidth = window.innerWidth;
    let heightClass = fullScreen ? 'h-screen' : 'h-auto';
    let aspectRatio = 'aspect-[21/9]';

    if (windowWidth < 640) {
      aspectRatio = 'aspect-[640/480]';
      if (!fullScreen) heightClass = 'h-[480px]';
    } else if (windowWidth < 1024) {
      aspectRatio = 'aspect-[1024/576]';
      if (!fullScreen) heightClass = 'h-[576px]';
    } else {
      aspectRatio = 'aspect-[21/9]';
      if (!fullScreen) heightClass = 'h-[500px]'; // <--- Antes siempre entraba aquí
    }

    setDimensions({ heightClass, aspectRatio });
  }, [fullScreen, height]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  useEffect(() => {
    if (safeSlides.length === 0) {
      setIsLoading(false);
    }
  }, [safeSlides]);

  const handleImageLoad = () => {
    setIsLoading(false);
    swiperRef.current?.update();
  };

  if (safeSlides.length === 0) {
    return null;
  }

  return (
    <div className={`relative w-full transition-all duration-300 overflow-hidden min-h-[300px] ${className} ${fullScreen ? 'max-h-screen' : 'max-h-none'} ${dimensions.heightClass} ${dimensions.aspectRatio}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-8 h-8 border-4 rounded-full sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-primary border-t-transparent animate-spin" />
        </div>
      )}

      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        speed={800}
        loop={safeSlides.length > 1}
        autoplay={autoSlide && safeSlides.length > 1 ? { delay: autoSlideInterval, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary',
          bulletClass: 'swiper-pagination-bullet !w-2 !h-2 sm:!w-2.5 sm:!h-2.5 !bg-white/70 !opacity-100',
        }}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        className={`w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
      >
        {safeSlides.map(({ id, image, imageTablet, imageMobile, alt }) => {
          const mainImage = image || imageTablet || imageMobile;

          if (!mainImage) return null;

          return (
            <SwiperSlide key={id} className="relative h-full">
              <picture className="block w-full h-full">
                <source media="(min-width: 1024px)" srcSet={mainImage} />
                <source media="(min-width: 640px)" srcSet={imageTablet || mainImage} />
                <source media="(max-width: 639px)" srcSet={imageMobile || imageTablet || mainImage} />

                <img
                  src={mainImage}
                  alt={alt || 'Slider image'}
                  onLoad={handleImageLoad}
                  onError={handleImageLoad}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading="lazy"
                  width={1920}
                  height={820}
                  decoding="async"
                />
              </picture>
            </SwiperSlide>
          );
        })}

        {safeSlides.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
            <div className="pointer-events-auto">
              <NavigationButton direction="prev" onClick={() => swiperRef.current?.slidePrev()} />
            </div>
            <div className="pointer-events-auto">
              <NavigationButton direction="next" onClick={() => swiperRef.current?.slideNext()} />
            </div>
          </div>
        )}
      </Swiper>
    </div>
  );
};