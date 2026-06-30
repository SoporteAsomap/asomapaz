import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { loansService } from '@/api';
import type { ILoanData } from '@/interfaces';
// Iconos modernos para estilizar las listas y el botón
import { FaCheckCircle, FaInfoCircle, FaFileContract, FaCalculator } from 'react-icons/fa';
// Importamos el Modal de la Calculadora desde la carpeta de componentes compartidos
import CalculatorModal from '@/components/CalculatorModal';

const LoanDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loanData, setLoanData] = useState<ILoanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para controlar el Modal de la Calculadora
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        setLoading(true);
        setError(null);

        const loans = await loansService.getAllLoans();
        const loan = loans.find((item: any) => item.slug === slug);

        if (loan) {
          const normalizedLoan: ILoanData = {
            ...loan,
            id: Number(loan.id),
            title: loan.title || '',
            description: loan.description || '',
            bannerImage: loan.bannerImage || '',
            loanType: String(loan.loanType || ''),
            details: Array.isArray(loan.details) ? loan.details : [],
            requirementsTitle: loan.requirementsTitle || '',
            requirements: Array.isArray(loan.requirements) ? loan.requirements : [],
            slug: loan.slug || '',
          };

          setLoanData(normalizedLoan);
        } else {
          setError('Préstamo no encontrado');
        }
      } catch (err) {
        setError('Error al cargar los datos del préstamo');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLoanData();
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4BA9] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando préstamo...</p>
        </div>
      </div>
    );
  }

  if (error || !loanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
          <p className="text-red-500 mb-6 font-medium">{error || 'Préstamo no encontrado'}</p>
          <button
            onClick={() => navigate('/productos')}
            className="px-6 py-2 bg-[#2B4BA9] hover:bg-blue-800 text-white font-semibold rounded-full transition-colors shadow-sm"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      
      {/* 1. TRUCO DEL BANNER: -mt-[100px] para meterse debajo del Navbar */}
      {loanData.bannerImage ? (
        <div className="relative -mt-[100px] w-full h-[350px] md:h-[450px] overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/80 via-[#2B4BA9]/30 to-transparent z-10"></div>
          <img
            src={loanData.bannerImage}
            alt={loanData.title}
            className="w-full h-full object-cover"
          />
          {/* Título sobre el banner */}
          <div className="absolute bottom-0 left-0 w-full z-20 pb-16 pt-8">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.h1 
                variants={sectionVariants} initial="hidden" animate="visible"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight"
              >
                {loanData.title}
              </motion.h1>
            </div>
          </div>
        </div>
      ) : (
        /* Alternativa si no hay banner: Fondo azul sólido con padding top para compensar el Navbar */
        <div className="relative -mt-[100px] pt-[150px] pb-24 bg-gradient-to-r from-[#2B4BA9] to-[#1a3072] z-10 overflow-hidden">
           <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
           <div className="container mx-auto px-4 lg:px-8 relative z-20">
             <motion.h1 
                variants={sectionVariants} initial="hidden" animate="visible"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
              >
                {loanData.title}
              </motion.h1>
           </div>
        </div>
      )}

      {/* 2. CONTENIDO PRINCIPAL: Superpuesto al banner con un margen negativo (-mt-8) y bordes redondeados */}
      <div className="container mx-auto px-4 lg:px-8 relative z-20 -mt-8">
        <motion.div 
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10"
          variants={staggerContainer} initial="hidden" animate="visible"
        >
          {/* Descripción */}
          <motion.p variants={sectionVariants} className="text-gray-700 text-lg leading-relaxed mb-8 text-justify">
            {loanData.description}
          </motion.p>

          
          <motion.div variants={sectionVariants} className="flex justify-end mb-12 border-b border-gray-100 pb-8">
            <button
              onClick={() => setIsCalculatorOpen(true)}
              className="group relative flex items-center justify-center space-x-3 bg-gradient-to-r from-[#F58220] to-[#e0751a] hover:from-[#e0751a] hover:to-[#c66412] text-white px-8 py-3.5 rounded-full font-bold text-[15px] shadow-[0_8px_20px_rgba(245,130,32,0.3)] hover:shadow-[0_10px_25px_rgba(245,130,32,0.4)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
          
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <FaCalculator className="w-5 h-5 relative z-10" />
              <span className="relative z-10 tracking-wide uppercase">Calculadora</span>
            </button>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Columna Izquierda: Detalles */}
            <div className="space-y-8">
              {loanData.details?.length > 0 && (
                <motion.div variants={sectionVariants} className="bg-blue-50/50 p-6 md:p-8 rounded-2xl border border-blue-100/50 h-full">
                  <div className="flex items-center mb-6 text-[#2B4BA9]">
                    <FaInfoCircle className="w-6 h-6 mr-3" />
                    <h2 className="text-2xl font-bold">Detalles del Préstamo</h2>
                  </div>
                  <ul className="space-y-4">
                    {loanData.details.map((detail: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700 bg-white p-4 rounded-xl border border-blue-50 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-[#F58220] mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm md:text-base">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Columna Derecha: Requisitos */}
            <div className="space-y-8">
              {loanData.requirements?.length > 0 && (
                <motion.div variants={sectionVariants} className="bg-orange-50/50 p-6 md:p-8 rounded-2xl border border-orange-100/50 h-full">
                  <div className="flex items-center mb-6 text-[#F58220]">
                    <FaFileContract className="w-6 h-6 mr-3" />
                    <h2 className="text-2xl font-bold">
                      {loanData.requirementsTitle || 'Requisitos'}
                    </h2>
                  </div>
                  <ul className="space-y-4">
                    {loanData.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700 bg-white p-4 rounded-xl border border-orange-50 shadow-sm">
                        <FaCheckCircle className="w-4 h-4 text-[#2B4BA9] mt-1 mr-3 flex-shrink-0" />
                        <span className="text-sm md:text-base leading-snug">{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

          </div>
        </motion.div>
      </div>

      {/* Renderizado del Modal */}
      <CalculatorModal 
        isOpen={isCalculatorOpen} 
        closeModal={() => setIsCalculatorOpen(false)} 
      />
    </div>
  );
};

export default LoanDetail;