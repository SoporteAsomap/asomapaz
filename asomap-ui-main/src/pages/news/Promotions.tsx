import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { promotionsData } from '@/mocks';
import { promotionsService } from '@/api';
import type { IPromotionsData } from '@/interfaces';
import { Pagination, DynamicPromotionBanner } from '@/components';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

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

const ITEMS_PER_PAGE = 6;

const Promotions: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isChanging, setIsChanging] = useState(false);
  const [promotionsDataState, setPromotionsDataState] = useState<IPromotionsData | null>(null);
  const [loading, setLoading] = useState(true);

  const handlePromotionClick = (slug: string) => {
    navigate(`/novedades/promociones/${slug}`);
  };

  useEffect(() => {
    const fetchPromotionsData = async () => {
      try {
        setLoading(true);
        const data = await promotionsService.getPromotions();
        setPromotionsDataState(data);
      } catch (error) {
        setPromotionsDataState(promotionsData); // Fallback a mock data
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionsData();
  }, []);

  if (loading || !promotionsDataState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(promotionsDataState.slides.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPromotions = promotionsDataState.slides.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    setIsChanging(true);
    await new Promise(resolve => setTimeout(resolve, 300)); // Wait for exit animations
    setCurrentPage(page);
    setIsChanging(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="font-sans"
    >
      {/* Dynamic Banner Section */}
      <DynamicPromotionBanner 
        promotions={promotionsDataState.slides} 
        autoSlideInterval={4000} // 4 segundos
      />

      {/* Promotions Grid */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={gridVariants}
            initial="hidden"
            animate={isChanging ? "hidden" : "visible"}
            exit="hidden"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {currentPromotions.map((promotion: any) => (
              <motion.div
                key={promotion.id}
                variants={itemVariants}
                onClick={() => handlePromotionClick(promotion.slug)}
                className="bg-white rounded-[20px] sm:rounded-[30px] lg:rounded-[50px] shadow-md hover:shadow-lg transition-all cursor-pointer group"
                layout
              >
                <div className="relative overflow-hidden rounded-[20px] sm:rounded-[30px] lg:rounded-[50px]">
                  <img
                    src={promotion.image}
                    alt={String(promotion.title)}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  {promotion.category && (
                    <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {promotion.category}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {promotion.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{promotion.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{promotion.date}</span>
                    {promotion.validUntil && (
                      <span className="text-primary">
                        Válido hasta: {promotion.validUntil}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Promotions;

