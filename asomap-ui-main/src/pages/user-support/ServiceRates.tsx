import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { serviceRatesService } from '@/api';
import type { IServiceRatesData } from '@/interfaces';
import { Spinner } from '@/components';

const ServiceRates: React.FC = () => {
  const [data, setData] = useState<IServiceRatesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const serviceRatesData = await serviceRatesService.getServiceRates();
        setData(serviceRatesData);
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

  // Filtrar servicios basado en búsqueda y categoría
  const filteredServices = data.categories
    .filter(cat => selectedCategory === 'all' || cat.name === selectedCategory)
    .flatMap(cat => cat.rates)
    .filter(service =>
      service.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative -mt-[90px]"
      >
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
          {/* Hero Banner */}
          <motion.div
            className="relative h-auto min-h-[120px] bg-[#FBE3D2] py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-[#FBE3D2] rounded-b-[50px] mix-blend-opacity-10"
            />
            <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center relative z-10">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                {data.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 text-sm"
              >
                {data.description}
              </motion.p>
            </div>
          </motion.div>

          {/* Barra de Búsqueda y Filtros */}
          <div className="container mx-auto px-6 pt-8">
            <div className="flex flex-col gap-6">
              {/* Barra de búsqueda */}
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar servicios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-sm"
                />
              </div>

              {/* Botones de categoría */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedCategory === 'all'
                      ? 'bg-[#2B4BA9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Todos
                </button>
                {Array.from(new Set(data.categories.map(cat => cat.name))).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedCategory === category
                        ? 'bg-[#2B4BA9] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Servicios */}
          <div className="container mx-auto px-6 py-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid gap-6"
            >
              {filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={itemVariants}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.service}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>
                        {service.details && (
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div 
                              className="text-sm text-gray-600"
                              dangerouslySetInnerHTML={{ __html: service.details }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <div className="text-xl font-bold text-[#2B4BA9] bg-blue-50 px-4 py-2 rounded-lg">
                          {service.rate}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceRates;
