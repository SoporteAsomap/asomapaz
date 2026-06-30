import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFilePdf, FaCalendarAlt } from 'react-icons/fa';
import "react-datepicker/dist/react-datepicker.css";
import { abandonedAccountsService } from '@/api';
import type { IAbandonedAccountsData } from '@/interfaces';
import DatePicker from 'react-datepicker';

const AbandonedAccounts: React.FC = () => {
  const [data, setData] = useState<IAbandonedAccountsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const abandonedAccountsData = await abandonedAccountsService.getAbandonedAccounts();
        setData(abandonedAccountsData);
        
      } catch (err) {
        setError('Error al cargar los datos de cuentas abandonadas');
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
          <p className="text-gray-600">Cargando cuentas abandonadas...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'No se pudieron cargar los datos'}</p>
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

  // Obtener todos los documentos de todos los años
  const allDocuments = data.years.flatMap(year => {
    return year.documents.map(doc => ({
      ...doc,
      year: year.year
    }));
  });

  // Los botones de filtro ahora filtran por tipo de cuenta, no por tipo de documento
  // Esto permite escalabilidad futura con diferentes tipos de cuenta

  // Filtrar documentos por año, tipo de cuenta y status
  const filteredDocuments = allDocuments.filter(doc => {
    const yearMatch = selectedYear === 'all' || doc.year === selectedYear;
    const typeMatch = selectedType === 'all' || doc.accountTypeId?.toString() === selectedType;
    const statusMatch = selectedStatus === 'all' || doc.type === selectedStatus;

    return yearMatch && typeMatch && statusMatch;
  });



  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Obtener años únicos para el filtro
  const availableYears = Array.from(new Set(allDocuments.map(doc => doc.year))).sort().reverse();
  const minYear = availableYears.length > 0 ? Math.min(...availableYears.map(Number)) : new Date().getFullYear();
  const maxYear = availableYears.length > 0 ? Math.max(...availableYears.map(Number)) : new Date().getFullYear();

  const handleYearChange = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear().toString();
      setSelectedYear(year);
      setCurrentPage(1);
    } else {
      setSelectedYear('all');
    }
    setDatePickerOpen(false);
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Generar array de números de página
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisible, 1);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
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
            className="relative h-[120px] bg-[#FBE3D2] py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="container relative px-6 mx-auto flex flex-col items-center justify-center h-full text-center">
              <motion.h1
                className="text-[#2B4BA9] text-2xl font-bold cursor-pointer"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {data.title}
              </motion.h1>
              <motion.p
                className="text-gray-600 text-sm mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {data.description}
              </motion.p>
            </div>
          </motion.div>

          {/* Filtros */}
          <div className="container mx-auto px-6 pt-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {/* Tipos de Cuenta */}
              <div className="container mx-auto px-6 pt-8">
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => {
                      setSelectedType('all');
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedType === 'all'
                        ? 'bg-[#2B4BA9] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Todos
                  </button>
                  {data.accountTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setSelectedType(type.id.toString());
                        setCurrentPage(1);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedType === type.id.toString()
                          ? 'bg-[#2B4BA9] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro por Status */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => {
                    setSelectedStatus('all');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedStatus === 'all'
                      ? 'bg-[#2B4BA9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Todos los Status
                </button>
                <button
                  onClick={() => {
                    setSelectedStatus('abandoned');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedStatus === 'abandoned'
                      ? 'bg-[#2B4BA9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Abandonadas
                </button>
                <button
                  onClick={() => {
                    setSelectedStatus('inactive');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedStatus === 'inactive'
                      ? 'bg-[#2B4BA9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Inactivas
                </button>
              </div>

              {/* Filtro por Año */}
              <div className="relative">
                <button
                  onClick={() => setDatePickerOpen(!datePickerOpen)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center gap-2 ${selectedYear !== 'all'
                      ? 'bg-[#2B4BA9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  <FaCalendarAlt className="text-base" />
                  {selectedYear === 'all' ? 'Seleccionar Año' : `Año ${selectedYear}`}
                </button>
                {datePickerOpen && (
                  <div className="absolute z-50 mt-2 transform -translate-x-1/2 left-1/2 sm:transform-none sm:left-0">
                    <DatePicker
                      selected={selectedYear !== 'all' ? new Date(Number(selectedYear), 0) : null}
                      onChange={handleYearChange}
                      showYearPicker
                      dateFormat="yyyy"
                      minDate={new Date(minYear, 0)}
                      maxDate={new Date(maxYear, 11)}
                      inline
                      popperClassName="react-datepicker-popper"
                      calendarClassName="bg-white border rounded-lg shadow-lg"
                      yearItemNumber={6}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lista de PDFs */}
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col space-y-4">
              {currentItems.map((pdf, index) => (
                <motion.a
                  key={index}
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 bg-white border-l-4 border-[#F18221] hover:border-[#2B4BA9] transition-all duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <FaFilePdf className="text-[#F18221] text-xl mr-4 flex-shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-gray-700 hover:text-[#2B4BA9] transition-colors duration-300">
                      {pdf.title}
                    </span>
                    <span className="text-sm text-gray-500">
                      Año {pdf.year} - {pdf.type === 'abandoned' ? 'Abandonada' : 'Inactiva'}
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg ${currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#2B4BA9] text-white hover:bg-[#2B4BA9]/90'
                    } transition-colors duration-300`}
                >
                  Primera
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg ${currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#2B4BA9] text-white hover:bg-[#2B4BA9]/90'
                    } transition-colors duration-300`}
                >
                  Anterior
                </button>

                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 rounded-lg ${currentPage === pageNumber
                        ? 'bg-[#2B4BA9] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors duration-300`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg ${currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#2B4BA9] text-white hover:bg-[#2B4BA9]/90'
                    } transition-colors duration-300`}
                >
                  Siguiente
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg ${currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#2B4BA9] text-white hover:bg-[#2B4BA9]/90'
                    } transition-colors duration-300`}
                >
                  Última
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AbandonedAccounts;


