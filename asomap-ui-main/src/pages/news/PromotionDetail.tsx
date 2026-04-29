import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { IPromotionsData, IPromotionMedia, IPromotionContent } from '@/interfaces/promotions.interface';
import { promotionsService } from '@/api';

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

const MediaGallery: React.FC<{ media: IPromotionMedia[] }> = ({ media }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      {media.map((item: any, index: number) => (
        <div key={index} className="relative">
          {item.type === 'image' ? (
            <div className="group relative overflow-hidden rounded-[20px] sm:rounded-[30px] lg:rounded-[50px]">
              <img
                src={item.url}
                alt={item.caption || ''}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                  {item.caption}
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-video">
              <iframe
                src={item.url}
                className="absolute inset-0 w-full h-full rounded-[20px] sm:rounded-[30px] lg:rounded-[50px]"
                allowFullScreen
                title={item.caption || `Video ${index + 1}`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ContentSection: React.FC<{ content: IPromotionContent[] }> = ({ content }) => {
  return (
    <div className="space-y-6">
      {content.map((item: any, index: number) => {
        switch (item.type) {
          case 'paragraph':
            return (
              <p key={index} className="text-gray-700 leading-relaxed">
                {item.content as string}
              </p>
            );
          case 'subtitle':
            return (
              <h2 key={index} className="text-2xl font-bold text-primary mt-8 mb-4">
                {item.content as string}
              </h2>
            );
          case 'quote':
            return (
              <blockquote
                key={index}
                className="border-l-4 border-primary pl-4 italic text-gray-700 my-6"
              >
                {item.content as string}
              </blockquote>
            );
          case 'list':
            return (
              <ul key={index} className="list-disc list-inside space-y-2 text-gray-700">
                {(item.content as string[]).map((listItem: any, listIndex: number) => (
                  <li key={listIndex}>{listItem}</li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </div>
  );
};

const RelatedPromotions: React.FC<{ promotions: IPromotionsData['slides'] }> = ({ promotions }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {promotions.map((promo: any) => (
        <div
          key={promo.id}
          className="bg-white rounded-[20px] sm:rounded-[30px] lg:rounded-[50px] shadow-md hover:shadow-lg transition-all cursor-pointer group"
          onClick={() => navigate(`/novedades/promociones/${promo.slug}`)}
        >
          <div className="relative overflow-hidden rounded-[20px] sm:rounded-[30px] lg:rounded-[50px]">
            <img
              src={promo.image}
              alt={String(promo.title)}
              className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
            {promo.category && (
              <span className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                {promo.category}
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-primary mb-2">{promo.title}</h3>
            {promo.validUntil && (
              <p className="text-sm text-gray-600">Válido hasta: {promo.validUntil}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const PromotionDetail: React.FC = () => {
  const [promotionsData, setPromotionsData] = useState<IPromotionsData | null>(null);
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotionsData = async () => {
      try {
        const data = await promotionsService.getPromotions();
        setPromotionsData(data);
      } catch (error) {
        setPromotionsData(promotionsData); // Fallback a mock data
      }
    };

    fetchPromotionsData();
  }, []);

  useEffect(() => {
    if (promotionsData) {
      const promotion = promotionsData.slides.find((item: any) => item.slug === slug);
      if (!promotion) {
        navigate('/novedades/promociones');
      }
      window.scrollTo(0, 0);
    }
  }, [promotionsData, slug, navigate]);

  if (!promotionsData) return null;

  const promotion = promotionsData.slides.find((item: any) => item.slug === slug);
  const relatedPromotions = promotionsData.slides
    .filter((item: any) => item.slug !== slug)
    .slice(0, 3);

  if (!promotion) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="relative -mt-[80px]"
    >
      <div className="font-sans bg-white">
        {/* Banner Section */}
        <div className="relative h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] -mt-[80px] rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px] overflow-hidden">
          <img
            src={promotion.image}
            alt={String(promotion.title)}
            className="w-full h-full object-cover rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px]" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {promotion.category && (
              <span className="inline-block bg-primary px-3 py-1 rounded-full text-sm mb-4">
                {promotion.category}
              </span>
            )}
            <h1 className="text-4xl font-bold mb-2">{promotion.title}</h1>
            <div className="flex items-center gap-4">
              {promotion.validUntil && (
                <span className="text-primary bg-white px-3 py-1 rounded-full text-sm">
                  Válido hasta: {promotion.validUntil}
                </span>
              )}
              <span>{promotion.date}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Back to Promotions Button */}
          <div className="container mx-auto px-4 py-6">
            <button
              onClick={() => navigate('/novedades/promociones')}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Volver a Promociones
            </button>
          </div>

          {/* Tags */}
          {promotion.tags && promotion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {promotion.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Main Content */}
          {promotion.content && <ContentSection content={promotion.content} />}

          {/* Media Gallery */}
          {promotion.media && promotion.media.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-primary mt-12 mb-6">Galería</h2>
              <MediaGallery media={promotion.media} />
            </>
          )}

          {/* Related Links */}
          {promotion.relatedLinks && promotion.relatedLinks.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-primary mb-4">Enlaces Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promotion.relatedLinks.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="font-semibold text-primary mb-2">{link.title}</h3>
                    {link.description && (
                      <p className="text-gray-600 text-sm">{link.description}</p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Promotions */}
          {relatedPromotions.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-primary mb-6">Promociones Relacionadas</h2>
              <RelatedPromotions promotions={relatedPromotions} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionDetail;

