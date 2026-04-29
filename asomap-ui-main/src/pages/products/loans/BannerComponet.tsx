import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bannerService } from '@/api';
import type { IBannerDataAPI } from '@/interfaces';

interface BannerComponentProps {
  className?: string;
}

const BannerComponent: React.FC<BannerComponentProps> = ({ className = '' }) => {
  const [bannerData, setBannerData] = useState<IBannerDataAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setLoading(true);
        const banner = await bannerService.getMainBanner();
        setBannerData(banner);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchBannerData();
  }, []);

  if (loading) {
    return (
      <div className={`bg-primary py-16 sm:py-24 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-blue-200 rounded mb-4 mx-auto max-w-md"></div>
            <div className="h-6 bg-blue-200 rounded mb-8 mx-auto max-w-2xl"></div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 bg-blue-200 rounded w-48 mx-auto"></div>
              <div className="h-12 bg-blue-200 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (

    <div className="bg-primary py-16 sm:py-24 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          {bannerData?.title}
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
          {bannerData?.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {bannerData?.button1Name && bannerData?.button1Url ? (
            <button 
              onClick={() => window.open(bannerData.button1Url, '_blank')}
              className="bg-primary-accent text-white px-6 py-2 rounded-full hover:bg-primary hover:border-2 hover:border-white transition-colors"
            >
              {bannerData.button1Name}
            </button>
          ) : (
            <button className="bg-primary-accent text-white px-6 py-2 rounded-full hover:bg-primary transition-colors">
              Solicitar Préstamo
            </button>
          )}
          
          {bannerData?.button2Name && bannerData?.button2Url ? (
            <button 
              onClick={() => window.open(bannerData.button2Url, '_blank')}
              className="bg-primary border-2 border-white text-white px-6 py-2 rounded-full hover:bg-primary-accent transition-colors"
            >
              {bannerData.button2Name}
            </button>
          ) : (
            <button 
              onClick={() => navigate('/productos')}
              className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-accent transition-colors"
            >
              Ver Otros Productos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerComponent;

