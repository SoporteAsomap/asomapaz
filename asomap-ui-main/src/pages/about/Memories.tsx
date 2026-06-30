import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { memoriesService } from '@/api';
import type { MemoriesResponse } from '@/interfaces';
import { PDFPreview } from '@/components';
import { Pagination } from '@/components';

const Memories: React.FC = () => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<MemoriesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await memoriesService.getMemories();
        setData(response);
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Cerrar el dropdown cuando se hace click fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowYearPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const itemsPerPage = 6;

  // Obtener todos los años disponibles
  const availableYears = data?.years.map(yearData => yearData.year).sort((a, b) => b.localeCompare(a)) || [];

  // Obtener todos los documentos
  const allDocuments = data?.years.flatMap(yearData =>
    yearData.documents.map(doc => ({
      ...doc,
      year: yearData.year
    }))
  ) || [];

  // Filtrar documentos por año
  const filteredDocuments = selectedYear === 'all'
    ? allDocuments
    : allDocuments.filter(doc => doc.year === selectedYear);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setCurrentPage(1);
    setShowYearPicker(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return null;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative -mt-[90px] w-full"
      >
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
          {/* Hero Banner */}
          <motion.div
            className="relative h-[120px] sm:h-[140px] bg-[#FBE3D2] py-4 sm:py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="container relative px-4 sm:px-6 mx-auto flex flex-col items-center justify-center h-full text-center">
              <motion.h1
                className="text-[#2B4BA9] text-xl sm:text-2xl font-bold cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {data.title}
              </motion.h1>
              <motion.p
                className="text-gray-600 text-xs sm:text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {data.description}
              </motion.p>
            </div>
          </motion.div>

          {/* Selector de Año */}
          <div className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
            <div className="flex justify-center">
              <div className="relative w-full max-w-[280px] sm:max-w-none" ref={dropdownRef}>
                <button
                  onClick={() => setShowYearPicker(!showYearPicker)}
                  className="w-full sm:w-auto min-w-[200px] px-4 sm:px-6 py-3 bg-white text-[#2B4BA9] border border-[#2B4BA9]/20 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#2B4BA9]/5 flex items-center justify-center group-hover:bg-[#2B4BA9]/10 transition-colors duration-300">
                      <svg
                        className="w-4 h-4 text-[#2B4BA9]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="font-medium text-sm sm:text-base">
                      {selectedYear === 'all' ? 'Todos los años' : `Año ${selectedYear}`}
                    </span>
                  </div>
                  <div className={`w-6 h-6 rounded-md bg-[#2B4BA9]/5 flex items-center justify-center transition-all duration-300 ${showYearPicker ? 'rotate-180 bg-[#2B4BA9]/10' : ''}`}>
                    <svg
                      className="w-4 h-4 text-[#2B4BA9]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                <AnimatePresence>
                  {showYearPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 mt-2 w-full sm:w-[280px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => handleYearChange('all')}
                          className={`w-full px-4 py-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${selectedYear === 'all' ? 'text-[#2B4BA9] font-medium bg-blue-50/50' : 'text-gray-700'
                            }`}
                        >
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center ${selectedYear === 'all' ? 'bg-[#2B4BA9] text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                          </div>
                          <span className="text-sm sm:text-base">Todos los años</span>
                        </button>

                        <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#2B4BA9]/10 hover:scrollbar-thumb-[#2B4BA9]/20 scrollbar-track-transparent scrollbar-thumb-rounded-full">
                          <div className="grid grid-cols-2 gap-1 mt-1 p-0.5">
                            {availableYears.map((year) => (
                              <button
                                key={year}
                                onClick={() => handleYearChange(year)}
                                className={`px-4 py-2.5 rounded-lg text-left hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${selectedYear === year ? 'text-[#2B4BA9] font-medium bg-blue-50/50' : 'text-gray-700'
                                  }`}
                              >
                                <div className={`w-6 h-6 rounded-md flex items-center justify-center ${selectedYear === year ? 'bg-[#2B4BA9] text-white' : 'bg-gray-100 text-gray-400'
                                  }`}>
                                  <span className="text-xs font-medium">{year.slice(2)}</span>
                                </div>
                                <span className="text-sm sm:text-base">{year}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Lista de Memorias */}
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {currentItems.map((doc, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* PDF Preview */}
                  <div className="h-[200px] sm:h-[250px]">
                    <PDFPreview
                      url={doc.url}
                      height="100%"
                      openButtonPosition="center"
                    />
                  </div>

                  {/* Año */}
                  <div className="p-3 sm:p-4 text-center">
                    <span className="text-base sm:text-lg font-semibold text-[#2B4BA9]">
                      Memoria {doc.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Memories;

