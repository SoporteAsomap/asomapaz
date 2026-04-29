import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { policiesService } from '@/api';
import type { PoliciesResponse } from '@/interfaces';
import { FaFilePdf } from 'react-icons/fa';
import { Pagination } from '@/components';

const Policies: React.FC = () => {
  const [data, setData] = useState<PoliciesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await policiesService.getPolicies();
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

  // Obtener todos los documentos de todas las categorías
  const allDocuments = data.categories.flatMap(category =>
    category.documents.map(doc => ({
      ...doc,
      categoryId: category.icon,
      categoryTitle: category.title
    }))
  );

  // Filtrar documentos por categoría
  const filteredDocuments = selectedCategory === 'all'
    ? allDocuments
    : allDocuments.filter(doc => doc.categoryId === selectedCategory);

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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

          {/* Categorías */}
          <div className="container mx-auto px-6 pt-8">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedCategory === 'all'
                  ? 'bg-[#2B4BA9] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {data.all_policies_text}
              </button>
              {data.categories.map((category) => (
                <button
                  key={category.icon}
                  onClick={() => handleCategoryChange(category.icon)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${selectedCategory === category.icon
                    ? 'bg-[#2B4BA9] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de PDFs */}
          <div className="container mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {currentItems.map((doc, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center p-6 bg-white rounded-lg shadow-md transition-shadow duration-300 ${
                    doc.url 
                      ? 'hover:shadow-lg cursor-pointer' 
                      : 'opacity-60 cursor-not-allowed'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={doc.url ? { scale: 1.02 } : {}}
                  whileTap={doc.url ? { scale: 0.98 } : {}}
                  onClick={doc.url ? () => window.open(doc.url!, '_blank') : undefined}
                >
                  <FaFilePdf className="text-[#F18221] text-3xl mr-4 flex-shrink-0" />
                  <div className="flex flex-col flex-grow">
                    <span className="text-gray-800 font-medium hover:text-[#2B4BA9] transition-colors duration-300">
                      {doc.title}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">{doc.categoryTitle}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(doc.lastUpdate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Policies;

