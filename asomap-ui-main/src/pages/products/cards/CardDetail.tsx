import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { cardsService } from '@/api';
import type { ICardData, ICardBenefit } from '@/interfaces';

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

        const card = cards.find((item: any) => {
          const cardSlug = String(item.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          return cardSlug === slug;
        });

        if (card) {
          const normalizedBenefits: ICardBenefit[] = Array.isArray(card.benefits)
            ? card.benefits.map((benefit: any) => ({
                icon: benefit?.icon || '',
                text: benefit?.text || benefit?.title || '',
              }))
            : [];

          const normalizedCard: ICardData = {
            ...card,
            id: Number(card.id),
            bannerImage: card.bannerImage || '',
            cardImage: card.cardImage || '',
            description: card.description || '',
            title: card.title || '',
            benefits: normalizedBenefits,
            features: Array.isArray(card.features) ? card.features : [],
            requirements: Array.isArray(card.requirements) ? card.requirements : [],
          };

          setCardData(normalizedCard);
        } else {
          setError('Tarjeta no encontrada');
        }
      } catch (err) {
        setError('Error al cargar los datos de la tarjeta');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCardData();
    }
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tarjeta...</p>
        </div>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Tarjeta no encontrada'}</p>
          <button
            onClick={() => navigate('/productos')}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {cardData.bannerImage && (
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={cardData.bannerImage}
            alt={cardData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {cardData.title}
          </h1>

          <p className="text-gray-700 mb-6">{cardData.description}</p>

          {cardData.cardImage && (
            <img
              src={cardData.cardImage}
              alt={cardData.title}
              className="w-full max-w-xl mb-6 rounded-lg shadow"
            />
          )}

          {cardData.features?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Características</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {cardData.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {cardData.requirements?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Requisitos</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {cardData.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {cardData.benefits?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Beneficios</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {cardData.benefits.map((benefit: ICardBenefit, index: number) => (
                  <li key={index}>{benefit.text}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CardDetail;

