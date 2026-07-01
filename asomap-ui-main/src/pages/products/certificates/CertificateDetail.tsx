import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { certificatesService } from '@/api';
import { FaCheckCircle, FaInfoCircle, FaStar, FaChartLine, FaQuestionCircle, FaHandHoldingUsd } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const CertificateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const all = await certificatesService.getAllCertificates();
        const cert = all.find((item: any) => item.slug === slug);
        if (cert) setData(cert);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetch();
  }, [slug]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4BA9]"></div>
    </div>
  );

  if (!data) return null;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      {/* BANNER INTEGRADO */}
      <div className="relative -mt-[100px] w-full h-[400px] overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2c6b]/80 via-[#2B4BA9]/30 to-transparent z-10"></div>
        <img src={data.bannerImage} alt={data.title} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 left-0 w-full z-20 pb-16 pt-8">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.h1 variants={sectionVariants} initial="hidden" animate="visible" className="text-4xl lg:text-5xl font-extrabold text-white">{data.title}</motion.h1>
            {data.subtitle && <p className="text-white/90 text-lg mt-2">{data.subtitle}</p>}
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container mx-auto px-4 lg:px-8 relative z-20 -mt-8">
        <motion.div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10" initial="hidden" animate="visible" variants={sectionVariants}>
          
          <p className="text-gray-700 text-lg leading-relaxed mb-12 text-justify">{data.description}</p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Beneficios */}
            {data.benefits?.items?.length > 0 && (
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center mb-6 text-[#2B4BA9]"><FaStar className="mr-3" /> <h2 className="text-xl font-bold">{data.benefits.title}</h2></div>
                <div className="space-y-3">{data.benefits.items.map((item: any, i: number) => (
                  <div key={i} className="flex items-start bg-white p-3 rounded-lg text-sm md:text-base border border-blue-50 shadow-sm">
                    <FaCheckCircle className="text-[#2B4BA9] mt-1 mr-3 flex-shrink-0" /> {typeof item === 'string' ? item : item.text}
                  </div>
                ))}</div>
              </div>
            )}

            {/* Inversión */}
            {data.investment?.details?.length > 0 && (
              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                <div className="flex items-center mb-6 text-[#F58220]"><FaHandHoldingUsd className="mr-3" /> <h2 className="text-xl font-bold">{data.investment.title}</h2></div>
                <ul className="space-y-3">{data.investment.details.map((d: any, i: number) => (
                  <li key={i} className="text-gray-700 flex items-center"><span className="w-2 h-2 bg-[#2B4BA9] rounded-full mr-3"></span> {typeof d === 'string' ? d : `${d.label}: ${d.value}`}</li>
                ))}</ul>
              </div>
            )}
          </div>

          {/* Tasas y Requisitos en Grid */}
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            {data.depositRates?.items?.length > 0 && (
              <div className="p-6 border border-gray-100 rounded-2xl">
                <div className="flex items-center mb-4 text-[#2B4BA9]"><FaChartLine className="mr-2" /> <h3 className="font-bold">{data.depositRates.title}</h3></div>
                <ul className="text-sm text-gray-600">{data.depositRates.items.map((item: any, i: number) => (
                  <li key={i} className="py-2 border-b border-gray-50">{item.range} - <span className="font-bold">{item.rate}</span></li>
                ))}</ul>
              </div>
            )}
            
            {data.requirements?.items?.length > 0 && (
              <div className="p-6 border border-gray-100 rounded-2xl">
                <div className="flex items-center mb-4 text-[#2B4BA9]"><FaInfoCircle className="mr-2" /> <h3 className="font-bold">{data.requirements.title}</h3></div>
                <ul className="space-y-2">{data.requirements.items.map((r: any, i: number) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center">✓ {r}</li>
                ))}</ul>
              </div>
            )}
          </div>
          
          {/* FAQ */}
          {data.faq?.items?.length > 0 && (
            <div className="mt-12 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-bold text-[#2B4BA9] mb-6 flex items-center"><FaQuestionCircle className="mr-2" /> {data.faq.title}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.faq.items.map((f: any, i: number) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-bold text-sm text-gray-800">{f.question}</p>
                    <p className="text-sm text-gray-600 mt-1">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateDetail;