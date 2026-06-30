import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { cardsService } from '@/api';
import type { ICardData, ICardBenefit } from '@/interfaces';
// Iconos modernos
import { FaCheckCircle, FaInfoCircle, FaStar, FaCreditCard } from 'react-icons/fa';

const CardDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [cardData, setCardData] = useState<ICardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const cards = await cardsService.getAllCards();
        const card = cards.find((item: any) => item.slug === slug);

        if (card) {
          const normalizedBenefits: ICardBenefit[] = Array.isArray(card.benefits)
            ? card.benefits.map((benefit: any) => ({
                icon: benefit?.icon || '',
                text: benefit?.text || benefit?.title || '',
              }))
            : [];

          setCardData({
            ...card,
            id: Number(card.id),
            bannerImage: card.bannerImage || '',
            cardImage: card.cardImage || '',
            description: card.description || '',
            title: card.title || '',
            benefits: normalizedBenefits,
            features: Array.isArray(card.features) ? card.features : [],
            requirements: Array.isArray(card.requirements) ? card.requirements : [],
          });
        } else {
          setError('Tarjeta no encontrada');
        }
      } catch (err) {
        setError('Error al cargar los datos de la tarjeta');
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCardData();
  }, [slug]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4BA9]"></div>
    </div>
  );

  if (error || !cardData) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-center bg-white p-8 rounded-2xl shadow-sm">
        <p className="text-red-500 mb-6">{error || 'Tarjeta no encontrada'}</p>
        <button onClick={() => navigate('/productos')} className="px-6 py-2 bg-[#2B4BA9] text-white rounded-full">Volver</button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* BANNER DINÁMICO */}
      {cardData.bannerImage ? (
        <div className="relative -mt-[100px] w-full h-[400px] overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/80 via-[#2B4BA9]/30 to-transparent z-10"></div>
          <img src={cardData.bannerImage} alt={cardData.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 left-0 w-full z-20 pb-16 pt-8">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.h1 variants={sectionVariants} initial="hidden" animate="visible" className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {cardData.title}
              </motion.h1>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative -mt-[100px] pt-[150px] pb-24 bg-gradient-to-r from-[#2B4BA9] to-[#1a3072] z-10">
          <div className="container mx-auto px-4 lg:px-8">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white">{cardData.title}</h1>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div className="container mx-auto px-4 lg:px-8 relative z-20 -mt-8">
        <motion.div 
          className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10"
          variants={staggerContainer} initial="hidden" animate="visible"
        >
          <motion.p variants={sectionVariants} className="text-gray-700 text-lg leading-relaxed mb-10 text-justify">
            {cardData.description}
          </motion.p>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Columna Izquierda: Imagen + Características */}
            <div className="space-y-8">
              {cardData.cardImage && (
                <motion.div variants={sectionVariants} className="flex justify-center">
                  <img src={cardData.cardImage} alt={cardData.title} className="w-full max-w-sm rounded-2xl shadow-lg border border-gray-100" />
                </motion.div>
              )}
              
              {cardData.features?.length > 0 && (
                <motion.div variants={sectionVariants} className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center mb-4 text-[#2B4BA9]"><FaInfoCircle className="mr-2" /> <h2 className="font-bold text-xl">Características</h2></div>
                  <ul className="space-y-3">{cardData.features.map((f, i) => <li key={i} className="flex items-center text-gray-700"><FaCreditCard className="text-[#F58220] mr-3" /> {f}</li>)}</ul>
                </motion.div>
              )}
            </div>

            {/* Columna Derecha: Beneficios y Requisitos */}
            <div className="space-y-8">
              {cardData.benefits?.length > 0 && (
                <motion.div variants={sectionVariants}>
                  <div className="flex items-center mb-6 text-[#2B4BA9]"><FaStar className="text-[#F58220] mr-2" /> <h2 className="font-bold text-2xl">Beneficios</h2></div>
                  <div className="grid gap-4">{cardData.benefits.map((b, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start">
                      <FaCheckCircle className="text-[#2B4BA9] mt-1 mr-4 flex-shrink-0" />
                      <p className="text-gray-700">{b.text}</p>
                    </div>
                  ))}</div>
                </motion.div>
              )}
              
              {cardData.requirements?.length > 0 && (
                <motion.div variants={sectionVariants} className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">
                  <div className="flex items-center mb-4 text-[#F58220]"><FaCheckCircle className="mr-2" /> <h2 className="font-bold text-xl">Requisitos</h2></div>
                  <ul className="space-y-3">{cardData.requirements.map((r, i) => <li key={i} className="flex items-start text-gray-700"><span className="w-2 h-2 rounded-full bg-[#2B4BA9] mt-2 mr-3 flex-shrink-0"></span> {r}</li>)}</ul>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CardDetail;