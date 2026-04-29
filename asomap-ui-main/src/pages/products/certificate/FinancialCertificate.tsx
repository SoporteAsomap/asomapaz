import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaAward, FaDesktop, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { financialCertificateData } from '@/mocks';
import { Button } from '@components/ui';

const DepositRatesTable = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-4 sm:mb-8">
        {financialCertificateData.depositRates.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-indigo-100 text-primary">
            <tr>
              <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Rango</th>
              <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Tasa</th>
              <th className="py-2 px-3 sm:py-3 sm:px-4 text-left text-xs sm:text-sm">Plazo</th>
            </tr>
          </thead>
          <tbody>
            {financialCertificateData.depositRates.items.map((rate, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium">{rate.range}</td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs sm:text-sm text-neutral-100 font-bold">{rate.rate}</td>
                <td className="py-2 px-3 sm:py-3 sm:px-4 text-xs text-neutral-100 sm:text-sm">{rate.term}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs sm:text-sm text-neutral-100 mt-4 text-center">
        {financialCertificateData.depositRates.validFrom}
      </p>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial={false}
    >
      <motion.button
        className="w-full flex justify-between items-center p-3 sm:p-4 font-semibold cursor-pointer text-primary hover:bg-gray-50 transition-colors duration-300 text-sm sm:text-base"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <motion.span
          className="relative w-5 h-5 flex items-center justify-center text-[#F4A649] text-xl font-bold"
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          +
        </motion.span>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 border-t border-gray-100">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FinancialCertificate: React.FC = () => {
  const benefitIcons = [FaDollarSign, FaAward, FaDesktop, FaClock];

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
      <div className="font-sans bg-gradient-to-b from-white to-blue-50/30">
        {/* Banner Section */}
        <div className="relative h-[360px] sm:h-[400px] md:h-[450px] lg:h-[500px] -mt-[80px]">
          <img src={financialCertificateData.banner.imageUrl} alt="Banner" className="w-full h-full object-cover rounded-b-[30px] sm:rounded-b-[50px] lg:rounded-b-[80px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title, Subtitle and CTA Buttons */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-primary mt-6 sm:mt-8 md:mt-12 mb-3 sm:mb-4 md:mb-6" style={{
            fontFamily: 'Open Sans, sans-serif',
            lineHeight: '1.2',
          }}>
            {financialCertificateData.mainTitle}
          </h1>
          <h2 className="text-center text-sm sm:text-base mb-4 sm:mb-6">
            {financialCertificateData.subtitle}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Button
              className="bg-primary-accent text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors text-sm w-full sm:w-auto"
              onClick={handleButtonClick}
            >
              {financialCertificateData.cta.apply}
            </Button>
            <Button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-accent transition-colors text-sm w-full sm:w-auto"
              onClick={handleButtonClick}
            >
              {financialCertificateData.cta.rates}
            </Button>
          </div>

          {/* Benefits Section */}
          <div className="my-8 sm:my-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-primary mb-6 sm:mb-8" style={{
              fontFamily: 'Open Sans, sans-serif',
              lineHeight: '1.2',
            }}>
              {financialCertificateData.benefits.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {financialCertificateData.benefits.items.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-[rgba(244,166,73,0.35)] rounded-[26px] p-4 sm:p-6 flex flex-col items-center justify-center text-center"
                >
                  <div className="mb-3 sm:mb-4">
                    {React.createElement(benefitIcons[index], { size: 36, className: "text-neutral-100" })}
                  </div>
                  <h3 className="font-bold text-sm sm:text-base mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Details Section */}
          <div className="mb-8 sm:mb-12 flex flex-col md:flex-row items-start">
            <div className="md:w-2/3 md:pr-6 mb-6 md:mb-0">
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-primary">
                {financialCertificateData.investment.title}
              </h3>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">
                {financialCertificateData.investment.subtitle}
              </p>
              <ul className="list-disc pl-5 space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                {financialCertificateData.investment.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full overflow-hidden">
                <img
                  src={financialCertificateData.investment.imageUrl}
                  alt="Investment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Rates and Requirements Section */}
          <div className="mb-8 sm:mb-12 bg-gray-50 rounded-lg overflow-hidden shadow-md">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 bg-white">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-primary border-b pb-2">
                  {financialCertificateData.rates.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {financialCertificateData.rates.items.map((rate, index) => (
                    <li key={index} className="flex justify-between items-center text-xs sm:text-sm">
                      <span className="text-gray-600">{rate.label}</span>
                      <span className="font-semibold text-gray-600">{rate.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 sm:p-6 bg-gray-50">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 text-primary border-b pb-2">
                  {financialCertificateData.requirements.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {financialCertificateData.requirements.items.map((req, index) => (
                    <li key={index} className="flex items-start text-xs sm:text-sm">
                      <span className="inline-block w-1.5 h-1.5 bg-neutral-100 rounded-full mr-2 mt-1.5"></span>
                      <span className="text-">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Deposit Rates Table Section */}
          <div className="mb-8 sm:mb-12">
            <DepositRatesTable />
          </div>

          {/* FAQ Section */}
          <div className="mb-8 sm:mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-primary mb-4 sm:mb-6">
              {financialCertificateData.faq.title}
            </h3>
            <div className="space-y-3 sm:space-y-4 max-w-3xl mx-auto">
              {financialCertificateData.faq.items.map((item, index) => (
                <FAQItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default FinancialCertificate;
