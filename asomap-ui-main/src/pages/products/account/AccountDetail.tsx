import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { accountsService } from '@/api';
import type { IAccountData, IAccountBenefit } from '@/interfaces';
import cards from '../cards';
// Nuevos iconos para estilizar las listas
import { FaCheckCircle, FaInfoCircle, FaStar } from 'react-icons/fa';

const AccountDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [accountData, setAccountData] = useState<IAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        setError(null);

        const accounts = await accountsService.getAllAccounts();
        const account = accounts.find((item: any) => item.slug === slug);

        if (account) {
          const normalizedBenefits: IAccountBenefit[] = Array.isArray(account.benefits)
            ? account.benefits.map((benefit: any) => ({
                icon: benefit?.icon || '',
                text: benefit?.text || benefit?.title || '',
              }))
            : [];

          const normalizedAccount: IAccountData = {
            ...account,
            id: Number(account.id),
            bannerImage: account.bannerImage || '',
            accountImage: account.accountImage || '',
            benefits: normalizedBenefits,
          };

          setAccountData(normalizedAccount);
        } else {
          setError('Cuenta no encontrada');
        }
      } catch (err) {
        setError('Error al cargar los datos de la cuenta');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAccountData();
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
          <p className="text-gray-600 font-medium">Cargando cuenta...</p>
        </div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
          <p className="text-red-500 mb-6 font-medium">{error || 'Cuenta no encontrada'}</p>
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
      {accountData.bannerImage ? (
        <div className="relative -mt-[100px] w-full h-[350px] md:h-[450px] overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/80 via-[#2B4BA9]/30 to-transparent z-10"></div>
          <img
            src={accountData.bannerImage}
            alt={accountData.title}
            className="w-full h-full object-cover"
          />
          {/* Título sobre el banner */}
          <div className="absolute bottom-0 left-0 w-full z-20 pb-16 pt-8">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.h1 
                variants={sectionVariants} initial="hidden" animate="visible"
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight"
              >
                {accountData.title}
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
                {accountData.title}
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
            {accountData.description}
          </motion.p>

          {/* Imagen de la Cuenta (Ej: Foto de una tarjeta) */}
          {accountData.accountImage && (
            <motion.div variants={sectionVariants} className="flex justify-center mb-12">
              <img
                src={accountData.accountImage}
                alt={accountData.title}
                className="w-full max-w-md rounded-2xl shadow-lg border border-gray-100"
              />
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Columna Izquierda: Características y Requisitos */}
            <div className="space-y-8">
              {accountData.features?.length > 0 && (
                <motion.div variants={sectionVariants} className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center mb-4 text-[#2B4BA9]">
                    <FaInfoCircle className="w-5 h-5 mr-2" />
                    <h2 className="text-xl font-bold">Características</h2>
                  </div>
                  <ul className="space-y-3">
                    {accountData.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F58220] mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm md:text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {accountData.requirements?.length > 0 && (
                <motion.div variants={sectionVariants} className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">
                  <div className="flex items-center mb-4 text-[#F58220]">
                    <FaCheckCircle className="w-5 h-5 mr-2" />
                    <h2 className="text-xl font-bold">Requisitos</h2>
                  </div>
                  <ul className="space-y-3">
                    {accountData.requirements.map((req: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2B4BA9] mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-sm md:text-base">{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Columna Derecha: Beneficios */}
            <div>
              {accountData.benefits?.length > 0 && (
                <motion.div variants={sectionVariants}>
                  <div className="flex items-center mb-6 text-[#2B4BA9]">
                    <FaStar className="w-6 h-6 mr-2 text-[#F58220]" />
                    <h2 className="text-2xl font-bold">Beneficios Principales</h2>
                  </div>
                  <div className="grid gap-4">
                    {accountData.benefits.map((benefit: IAccountBenefit, index: number) => (
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2B4BA9] mr-4 flex-shrink-0">
                          <FaCheckCircle className="w-5 h-5" />
                        </div>
                        <p className="text-gray-700 text-sm md:text-base pt-1">{benefit.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccountDetail;