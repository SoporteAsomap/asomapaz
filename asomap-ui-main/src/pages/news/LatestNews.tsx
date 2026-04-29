import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService } from '@/api';
import type { INewsData } from '@/interfaces/news.interface';
import DynamicNewsBanner from '@/components/DynamicNewsBanner';
import { normalizeMediaUrl } from '@/utils/media';

const ITEMS_PER_PAGE = 6;

const LatestNews: React.FC = () => {
  const navigate = useNavigate();

  const [newsDataState, setNewsDataState] = useState<INewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNewsClick = (id: number | string) => {
    navigate(`/novedades/ultimas-noticias/${id}`);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getNews();
        setNewsDataState(data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading || !newsDataState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando noticias...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(newsDataState.slides.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentNews = newsDataState.slides.slice(startIndex, endIndex);

  return (
    <div className="bg-gray-50 min-h-screen">
      <DynamicNewsBanner news={newsDataState.slides} />

      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentNews.map((newsItem: any) => (
            <div
              key={newsItem.id}
              onClick={() => handleNewsClick(newsItem.id)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={normalizeMediaUrl(newsItem.image)}
                  alt={String(newsItem.title)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              <div className="p-4">
                {newsItem.category && (
                  <span className="text-sm text-primary font-semibold">
                    {newsItem.category}
                  </span>
                )}

                <h3 className="text-lg font-bold mt-2 mb-2">
                  {newsItem.title}
                </h3>

                <p className="text-gray-600 mb-4">
                  {newsItem.description}
                </p>

                <div className="text-sm text-gray-500 flex justify-between">
                  <span>{newsItem.date}</span>
                  {newsItem.author && (
                    <span>Por: {newsItem.author}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-primary text-white'
                    : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestNews;

