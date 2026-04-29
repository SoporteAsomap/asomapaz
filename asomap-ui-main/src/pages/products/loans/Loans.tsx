import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { bannerData, loansData, personLoansData, whyLoanData } from '@/mocks';
import { ILoan } from '@interfaces';

const Loans: React.FC = () => {

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

  const navigate = useNavigate();

  const handleLoanClick = (type: ILoan['type']) => {
    switch (type) {
      case 'consumer':
        navigate('/productos/prestamos-consumo');
        break;
      case 'comercial':
        navigate('/productos/prestamos-comerciales');
        break;
      case 'mortgage':
        navigate('/productos/prestamos-hipotecarios');
        break;
      default:
    }
  };

  const handlePersonLoanClick = (title: string) => {
    const route = title.toLowerCase().replace(/\s+/g, '-').replace(/é/g, 'e');
    navigate(`/products/${route}-loans`);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={sectionVariants}
      className="relative -mt-[80px]"
    >
      <div className="font-sans bg-gradient-to-b from-white to-blue-50/30">
        {/* Hero Section */}
        <div className="relative h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] -mt-[80px]">
          <img
            src={bannerData.imageUrl}
            alt="Loans Banner"
            className="w-full h-full object-cover rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px]" />
        </div>

        <div className="bg-white py-12 sm:py-16 md:py-24  mx-auto max-w-7xl px-2 sm:px-4 lg:px-4">
          {/* Préstamos a tu medida Section */}
          <h2 className="text-4xl font-bold text-center text-[#2D4394] mt-16 mb-8" style={{
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '54px',
          }}>
            Préstamos a tu medida
          </h2>
          <p className="text-center text-lg mb-16">
            En la Asociación Cibao de Ahorros y Préstamos nos preocupamos por ser tu mejor opción.
          </p>

          {/* Loan Types Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {loansData.map((loan, index) => (
              <div
                key={index}
                className="bg-white pt-10 p-4 rounded-lg shadow-md flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors w-full h-[175px]"
                onClick={() => handleLoanClick(loan.type)}
              >
                <img
                  src={loan.image}
                  alt={`Loan ${loan.title}`}
                  className="w-20 h-25 object-contain"
                  loading="lazy"
                />
                <span className="font-semibold text-base">{loan.title}</span>
              </div>
            ))}
          </div>

          {/* Accede hoy al Préstamo Section */}
          <h2 className="text-3xl font-bold text-center text-[#2D4394] mb-12" style={{
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '47px',
          }}>
            Accede hoy al Préstamo que se ajusta a ti
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {personLoansData.map((loan, index) => (
              <div
                key={index}
                className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col max-w-[250px] mx-auto cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handlePersonLoanClick(loan.title)}
              >
                <img
                  src={loan.image}
                  alt={loan.title}
                  className="w-full h-36 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-center">{loan.title}</h3>
                  <p className="text-sm text-gray-600">{loan.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sección "Por qué adquirir un Préstamo" */}
          <div className="bg-[#FFF5F0] w-full">
            <div className="p-4 md:p-8 flex flex-col md:flex-row items-start mb-8">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <img
                  src={whyLoanData.image}
                  alt="House illustration"
                  className="w-full h-auto"
                />
              </div>
              <div className="md:w-2/3 md:pl-8">
                <h2 className="text-2xl font-semibold mb-4 text-[#2D4394]">
                  {whyLoanData.title}
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {whyLoanData.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#2D4394]">
                    {whyLoanData.existingLoanTitle}
                  </h3>
                  <p className="font-semibold mb-1">Ingresa a Mundo Hipotecario</p>
                  <p className="text-sm text-gray-600">
                    {whyLoanData.existingLoanDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default Loans;
