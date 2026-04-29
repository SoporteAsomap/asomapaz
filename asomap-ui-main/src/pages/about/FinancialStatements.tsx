import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { financialStatementsService } from '@/api';
import type { FinancialStatementsResponse } from '@/interfaces';
import { FaFilePdf, FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface FinancialDocument {
  title: string;
  url: string;
  type: 'audited' | 'quarterly';
  year: string;
  quarter?: string;
}

const FinancialStatements: React.FC = () => {
  const [data, setData] = useState<FinancialStatementsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const itemsPerPage = 6;

  // Get all documents from all years
  const allDocuments = data?.years.flatMap((year: any) => [
    ...year.documents.audited.map((doc: any) => ({
      ...doc,
      type: 'audited',
      year: year.year
    })),
    ...year.documents.quarterly.map((doc: any) => ({
      ...doc,
      type: 'quarterly',
      year: year.year
    }))
  ]) || [];

  // Get min and max years from data
  const years = data?.years.map((y: any) => parseInt(y.year)) || [];
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  // Filter documents by year and type
  const filteredDocuments = selectedYear === 'all'
    ? allDocuments
    : allDocuments.filter((doc: any) => doc.year === selectedYear);

  const filteredDocumentsByType = selectedType === 'all'
    ? filteredDocuments
    : filteredDocuments.filter((doc: any) => doc.type === selectedType);

  // Pagination
  const totalPages = Math.ceil(filteredDocumentsByType.length / itemsPerPage);
  const currentItems = filteredDocumentsByType.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleYearChange = (date: Date | null) => {
    if (date) {
      setSelectedYear(date.getFullYear().toString());
    } else {
      setSelectedYear('all');
    }
    setDatePickerOpen(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await financialStatementsService.getFinancialStatements();
        setData(response);
      } catch (err) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return null;

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        className="relative -mt-[90px]"
      >
        <div className="min-h-screen bg-gradient-to-b from-white to-blue-50/30">
          {/* Hero Banner */}
          <motion.div
            className="relative h-[120px] bg-[#FBE3D2] py-6 rounded-b-[50px]"
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

          {/* Filters */}
          <div className="container mx-auto px-6 pt-8">
            <div className="flex flex-col gap-4 items-center">
              {/* Year Filter */}
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

              {/* Document Types */}
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
                <button
                  onClick={() => {
                    setSelectedType('audited');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedType === 'audited'
                    ? 'bg-[#2B4BA9] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Estados Auditados
                </button>
                <button
                  onClick={() => {
                    setSelectedType('quarterly');
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedType === 'quarterly'
                    ? 'bg-[#2B4BA9] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Estados Trimestrales
                </button>
              </div>
            </div>
          </div>

          {/* PDF List */}
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col space-y-4">
              {currentItems.map((doc: any, index: number) => (
                <motion.a
                  key={index}
                  href={doc.url}
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
                      {doc.title}
                    </span>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <span>Año {doc.year}</span>
                      {doc.type === 'quarterly' && (doc as FinancialDocument).quarter && (
                        <>
                          <span>•</span>
                          <span>Q{(doc as FinancialDocument).quarter}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Primera
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded ${currentPage === page
                      ? 'bg-[#2B4BA9] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
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

export default FinancialStatements;

