import React, { useEffect, useState } from 'react';
import { Slider } from '@components/ui';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPiggyBank, FaMoneyBillWave, FaWallet, FaTimes } from 'react-icons/fa';
import { Pagination } from '@/components';
import { savingTipsService } from '@/api';
import type { ISavingTipData, ISliderSlideData, IFAQItemData } from '@/interfaces';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const ITEMS_PER_PAGE = 6;

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

const SavingTips: React.FC = () => {
  const [selectedTip, setSelectedTip] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isChanging, setIsChanging] = useState(false);
  
  // Estados para datos del backend
  const [tips, setTips] = useState<ISavingTipData[]>([]);
  const [slides, setSlides] = useState<ISliderSlideData[]>([]);
  const [faqItems, setFaqItems] = useState<IFAQItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [tipsData, slidesData, faqData] = await Promise.all([
          savingTipsService.getAllSavingTips(),
          savingTipsService.getSliderSlides(),
          savingTipsService.getFAQItems()
        ]);
        
        setTips(tipsData);
        setSlides(slidesData);
        setFaqItems(faqData);
        
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando consejos de ahorro...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(tips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTips = tips.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    setIsChanging(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for exit animations
    setCurrentPage(page);
    setIsChanging(false);
    const headerOffset = 80; // altura aproximada del navbar
    const element = document.querySelector('.tips-section');
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Transform slides data for Slider component
  const transformedSlides = slides.map(slide => ({
    id: slide.id,
    image: slide.image
  }));

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={gridVariants}
        className="relative -mt-[80px]"
      >
        <div className="relative h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px]">
          <Slider autoSlide={true} autoSlideInterval={3000} slides={transformedSlides} fullScreen={false} />
        </div>

        {/* Description Section */}
        <div className="py-12 bg-white sm:py-16">
          <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-primary">Consejos de Ahorro</h2>
            <p className="mb-8 text-lg text-gray-700">Aquí algunos consejos esenciales para mejorar tus finanzas personales.</p>
          </div>
        </div>

        {/* Tips Section */}
        <div className="py-16 bg-gray-50 sm:py-24 tips-section">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                variants={gridVariants}
                initial="hidden"
                animate={isChanging ? "hidden" : "visible"}
                exit="hidden"
                className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              >
                {currentTips.map((tip, index) => (
                  <motion.div
                    key={startIndex + index}
                    variants={itemVariants}
                    className="flex flex-col items-center p-6 transition-shadow duration-300 bg-white rounded-lg shadow-lg cursor-pointer hover:shadow-xl"
                    onClick={() => setSelectedTip(startIndex + index)}
                    layout
                  >
                    <h3 className="mb-2 text-xl font-semibold text-gray-800">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                    <button className="mt-4 transition-colors text-primary hover:text-primary-accent">
                      {tip.link ? 'Leer más' : 'Leer más'}
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedTip !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="w-full max-w-lg p-6 bg-white rounded-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{tips[selectedTip].title}</h3>
                  <button
                    type="button"
                    onClick={() => setSelectedTip(null)}
                    aria-label="Cerrar consejo de ahorro"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div 
                  className="mb-4 text-gray-600"
                  dangerouslySetInnerHTML={{ __html: tips[selectedTip].content }}
                />
               
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

       {/* Iconos representativos */}
        <div className="py-24 bg-white">
          <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
            <h2 className="mb-12 text-3xl font-bold text-primary">Consejos Clave</h2>
            
            {/* Usamos un grid de 3 columnas para garantizar el mismo espaciado y centrado */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              
              <div className="flex flex-col items-center justify-start">
                <FaPiggyBank className="mb-4 text-6xl text-primary hover:text-primary-accent transition-transform hover:scale-110 duration-300" />
                <span className="font-semibold text-gray-700">Ahorra Más</span>
              </div>
              
              <div className="flex flex-col items-center justify-start">
                <FaMoneyBillWave className="mb-4 text-6xl text-primary hover:text-primary-accent transition-transform hover:scale-110 duration-300" />
                <span className="font-semibold text-gray-700">Gasta Sabiamente</span>
              </div>
              
              <div className="flex flex-col items-center justify-start">
                <FaWallet className="mb-4 text-6xl text-primary hover:text-primary-accent transition-transform hover:scale-110 duration-300" />
                <span className="font-semibold text-gray-700 leading-tight">
                  Invierte <br /> Inteligentemente
                </span>
              </div>
              
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="p-8 mb-10 sm:mb-16">
          <h3 className="mb-4 text-xl font-bold text-center sm:text-2xl md:text-3xl text-primary sm:mb-6">
            Preguntas Frecuentes
          </h3>
          <div className="max-w-3xl mx-auto space-y-3 sm:space-y-4">
            {faqItems.map((item, index) => (
              <details
                key={index}
                className="overflow-hidden bg-white rounded-lg shadow-md group"
              >
                <summary className="flex items-center justify-between p-3 text-sm font-semibold transition-colors duration-300 cursor-pointer sm:p-4 text-primary hover:bg-gray-50 sm:text-base">
                  {item.question}
                  <span className="relative flex items-center justify-center w-5 h-5">
                    <span className="absolute inset-0 flex items-center justify-center text-primary">
                      +
                    </span>
                  </span>
                </summary>
                <div className="px-3 pt-0 pb-2 text-gray-600 sm:px-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SavingTips;
