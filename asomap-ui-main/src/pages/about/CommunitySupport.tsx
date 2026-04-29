import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { communityService } from '@/api';
import type { CommunitySupportResponse } from '@/interfaces';
import * as FaIcons from 'react-icons/fa';
import { Pagination } from '@/components';

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

const CommunitySupport: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<CommunitySupportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await communityService.getCommunitySupport();
        setData(response);
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-primary">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!data?.data) return null;

  const filteredInitiatives = selectedCategory === 'all'
    ? data.data.initiatives
    : data.data.initiatives.filter(
      initiative => {
        const category = data.data.categories.find(cat => cat.id === selectedCategory);
        return category && initiative.category === category.name;
      }
    );

  const getIconComponent = (iconName: string) => {
    const IconComponent = (FaIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="text-xl text-[#2B4BA9]" />;
    }
    return <FaIcons.FaQuestion className="text-xl text-[#2B4BA9]" />;
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredInitiatives.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentInitiatives = filteredInitiatives.slice(startIndex, endIndex);

  const handlePageChange = async (page: number) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="font-sans min-h-screen bg-gray-50"
    >
      {/* Hero Banner */}
      <motion.div
        className="relative h-[120px] sm:h-[140px] md:h-[160px] bg-[#FBE3D2] py-4 sm:py-6 md:py-8 rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px] -mt-[90px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container relative px-4 sm:px-6 mx-auto flex flex-col items-center justify-center h-full text-center">
          <div className="w-full max-w-[800px] mx-auto px-2">
            <motion.h1
              className="text-lg sm:text-2xl md:text-3xl font-bold text-[#2B4BA9] leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Apoyo a la Comunidad
            </motion.h1>
            <motion.p
              className="text-[11px] sm:text-sm md:text-base text-gray-600 mt-1.5 sm:mt-3 leading-snug line-clamp-2 sm:line-clamp-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {data.data.description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <div className="w-full container mx-auto px-3 sm:px-6 py-6 sm:py-12 md:py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={gridVariants}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className={`group bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 ${selectedCategory === 'all' ? 'ring-2 ring-[#2B4BA9]' : ''
              }`}
            onClick={() => setSelectedCategory('all')}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="bg-[#2B4BA9]/5 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#2B4BA9]/10 transition-colors">
                <FaIcons.FaUsers className="text-xs sm:text-base text-[#2B4BA9]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[12px] sm:text-[15px] font-semibold text-[#2B4BA9] mb-0.5 sm:mb-1">Todas las Iniciativas</h3>
                <p className="text-[10px] sm:text-[13px] text-gray-500 leading-snug line-clamp-2">{data.data.description}</p>
              </div>
            </div>
          </motion.div>

          {data.data.categories.map((category) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`group bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-gray-100 ${selectedCategory === category.id ? 'ring-2 ring-[#2B4BA9]' : ''
                }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="bg-[#2B4BA9]/5 w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#2B4BA9]/10 transition-colors">
                  {getIconComponent(category.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[12px] sm:text-[15px] font-semibold text-[#2B4BA9] mb-0.5 sm:mb-1">{category.name}</h3>
                  <p className="text-[10px] sm:text-[13px] text-gray-500 leading-snug line-clamp-2">{category.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Initiatives Grid */}
      <div className="container mx-auto px-2 sm:px-6 pb-8 sm:pb-12 md:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {currentInitiatives.map((initiative) => (
              <motion.div
                key={initiative.id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => navigate(`/nosotros/iniciativa/${initiative.id}`)}
              >
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={initiative.imageUrl}
                    alt={initiative.title}
                    className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-[#2B4BA9] mb-2 sm:mb-3">{initiative.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">{initiative.description}</p>
                  <p className="text-sm text-[#2B4BA9] font-medium line-clamp-1">{initiative.impact}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 sm:mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CommunitySupport;


