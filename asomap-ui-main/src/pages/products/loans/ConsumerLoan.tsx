import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { consumerLoansData } from '@/mocks';

const ConsumerLoan: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleButtonClick = () => {
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="relative -mt-[80px]"
    >
      <div className="font-sans bg-white">
        {/* Hero Section */}
        <div className="relative h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] -mt-[80px]">
          <img
            src={consumerLoansData.banner.imageUrl}
            alt="Consumer Loan Banner"
            className="w-full h-full object-cover rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title, Subtitle and CTA Buttons */}
          <h1 className="text-4xl font-bold text-center text-[#2D4394] mt-16 mb-8" style={{
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '54px',
          }}>
            {consumerLoansData.banner.title}
          </h1>
          <h2 className="text-center text-lg mb-16">
            {consumerLoansData.subtitle}
          </h2>
          <div className="flex justify-center gap-4 mb-16">
            <button
              className="bg-orange-500 text-white px-8 py-2 rounded-md hover:bg-orange-600 transition-colors"
              onClick={handleButtonClick}
            >
              Solicitar
            </button>
            <button
              className="bg-[#2D4394] text-white px-8 py-2 rounded-md hover:bg-blue-800 transition-colors"
              onClick={handleButtonClick}
            >
              Tarifario
            </button>
          </div>

          {/* Benefits Section */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-16">
            <h2 className="text-3xl font-bold text-center text-[#2D4394] mb-12" style={{
              fontFamily: 'Open Sans, sans-serif',
              lineHeight: '47px',
            }}>
              Beneficios de nuestro Préstamos de Consumo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {consumerLoansData.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center h-[200px] justify-between"
                >
                  <img src={benefit.iconUrl} alt={benefit.title} className="w-20 h-20 object-contain mb-3" />
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Requirements Section */}
          <div className="bg-[#FFF5F0] p-8  shadow-md flex flex-col md:flex-row items-start mb-24">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <img
                src={consumerLoansData.requirements.imageUrl}
                alt="Family"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="md:w-2/3 md:pl-8">
              <h2 className="text-2xl font-semibold mb-4 text-[#2D4394]">
                {consumerLoansData.requirements.title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {consumerLoansData.requirements.items.map((item, index) => (
                  <li key={index}>{item.text}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsumerLoan;
