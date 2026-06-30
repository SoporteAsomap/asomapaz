import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { rightsAndDutiesService } from '@/api';
import type { IRightsAndDutiesData } from '@/interfaces';
import { Spinner } from '@/components';

interface CarouselProps {
    images: { id: number; src: string; alt: string; description?: string }[];
    isVisible: boolean;
}

const ImageCarousel: React.FC<CarouselProps> = ({ images, isVisible }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isVisible && !isPaused) {
            interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === images.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000); // Cambia imagen cada 5 segundos
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isVisible, isPaused, images.length]);

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full overflow-hidden mt-6"
        >
            <div className="relative w-full">
                <div className="relative h-64 md:h-96 overflow-visible rounded-lg">
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                    >
                        <motion.div
                            className="relative w-full h-full flex items-center justify-center"
                            onMouseEnter={() => {
                                setIsPaused(true);
                                setIsZoomed(true);
                            }}
                            onMouseLeave={() => {
                                setIsPaused(false);
                                setIsZoomed(false);
                            }}
                        >
                            <motion.img
                                key={currentIndex}
                                src={images[currentIndex].src}
                                alt={images[currentIndex].alt}
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: isZoomed ? 2 : 1,
                                    transition: {
                                        opacity: { duration: 0.3 },
                                        scale: { duration: 0.3, ease: "easeOut" }
                                    }
                                }}
                                exit={{ opacity: 0 }}
                                className="w-full h-full object-contain cursor-zoom-in"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Controles de navegación */}
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                        <button
                            onClick={handlePrevious}
                            className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors transform hover:scale-110"
                            aria-label="Previous image"
                        >
                            <FaChevronLeft size={24} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors transform hover:scale-110"
                            aria-label="Next image"
                        >
                            <FaChevronRight size={24} />
                        </button>
                    </div>

                    {/* Indicadores */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'bg-blue-600 scale-125'
                                        : 'bg-gray-400 hover:bg-gray-600'
                                    }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>

                    {images[currentIndex].description && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-sm text-gray-600 mt-2 text-center"
                        >
                        </motion.p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

const Card = ({
    section,
    isPrimary,
    style
}: {
    section: IRightsAndDutiesData['sections'][0];
    isPrimary: boolean;
    style?: React.CSSProperties;
}) => {
    const [showImages, setShowImages] = useState(false);

    return (
        <div className="w-full">
            <motion.div
                id={`card-${section.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.5,
                        ease: "easeOut",
                        opacity: { duration: 0.3 }
                    }
                }}
                className={`w-full bg-gradient-to-br from-white via-white to-gray-50
                           rounded-xl sm:rounded-2xl 
                           shadow-md hover:shadow-lg transition-all duration-500
                           backdrop-blur-lg p-4
                           flex flex-col justify-between
                           min-h-[180px] sm:min-h-[200px]
                           border border-gray-100/50
                           hover:border-gray-200/50 group
                           overflow-hidden relative`}
                style={style}
            >
                {/* Decorative elements dentro del padding */}
                <div className="absolute top-2 right-2 w-12 h-12 
                              bg-gradient-to-br from-primary/5 to-secondary/5 
                              rounded-full blur-xl opacity-50
                              pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-12 h-12
                              bg-gradient-to-tr from-secondary/5 to-primary/5 
                              rounded-full blur-xl opacity-50
                              pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="relative z-10"
                >
                    <div className="flex items-start mb-3">
                        <div className={`shrink-0 w-6 h-6 sm:w-8 sm:h-8
                                      rounded-lg
                                      flex items-center justify-center
                                      ${isPrimary ? 'bg-primary/10' : 'bg-secondary/10'}
                                      mr-3
                                      group-hover:scale-110 transition-transform duration-300`}>
                            <motion.span
                                className={`text-sm sm:text-base
                                          ${isPrimary ? 'text-primary' : 'text-secondary'}`}
                                animate={{ rotate: showImages ? 90 : 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                →
                            </motion.span>
                        </div>
                        <h2 className="text-sm sm:text-base font-semibold text-gray-900 
                                     group-hover:translate-x-1 transition-transform duration-300 
                                     leading-tight flex-1">
                            {section.title}
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 
                                leading-relaxed pl-9 sm:pl-11">
                        {section.description}
                    </p>
                </motion.div>

                {/* Bottom floating arrow */}
                <div className="flex justify-center mt-4">
                    <motion.button
                        onClick={() => setShowImages(!showImages)}
                        className={`w-6 h-6 rounded-full 
                                  ${isPrimary ? 'bg-primary' : 'bg-secondary'} 
                                  shadow-md hover:shadow-lg flex items-center justify-center
                                  hover:scale-110 transition-transform duration-300
                                  focus:outline-none focus:ring-1 focus:ring-offset-1
                                  ${isPrimary ? 'focus:ring-primary/50' : 'focus:ring-secondary/50'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.span
                            className="text-white text-xs sm:text-sm"
                            animate={{ rotate: showImages ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            ↓
                        </motion.span>
                    </motion.button>
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {showImages && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full bg-white rounded-xl sm:rounded-2xl
                                 shadow-lg p-3 mt-3"
                    >
                        <div className="w-full h-full 
                                      min-h-[150px] sm:min-h-[180px]
                                      rounded-lg sm:rounded-xl
                                      overflow-hidden">
                            <ImageCarousel
                                images={section.images}
                                isVisible={true}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const RightsAndDuties: React.FC = () => {
    const [data, setData] = useState<IRightsAndDutiesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const fetchData = async () => {
            try {
                setLoading(true);
                const rightsAndDutiesData = await rightsAndDutiesService.getRightsAndDuties();
                setData(rightsAndDutiesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen font-sans">
                <div className="relative -mt-[90px]">
                    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 flex items-center justify-center">
                        <Spinner />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex flex-col min-h-screen font-sans">
                <div className="relative -mt-[90px]">
                    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30 flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                Error al cargar los datos
                            </h2>
                            <p className="text-gray-600">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen font-sans">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative -mt-[90px]"
            >
                <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
                    {/* Hero Banner */}
                    <motion.div
                        className="relative h-[130px] bg-[#FBE3D2] py-4 sm:py-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <div className="container relative px-4 sm:px-6 mx-auto flex flex-col items-center justify-center h-full text-center">
                            <motion.h1
                                className="text-[#2B4BA9] text-lg sm:text-xl lg:text-2xl font-bold cursor-pointer leading-tight mb-1"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {data.pageTitle}
                            </motion.h1>
                            <motion.p
                                className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 max-w-2xl px-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {data.pageDescription}
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="w-full max-w-7xl mx-auto px-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {data.sections.map((section, index) => (
                                <Card
                                    key={section.id}
                                    section={section}
                                    isPrimary={index % 2 === 0}
                                    style={{
                                        opacity: 0,
                                        transform: `translateY(${20 * (index + 1)}px)`,
                                        animation: `fadeIn 0.5s ease-out ${index * 0.1
                                            }s forwards`,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default RightsAndDuties;