import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { certificatesService } from '@/api';

const CertificateDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [certificateData, setCertificateData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        setLoading(true);
        setError(null);

        const certificates = await certificatesService.getAllCertificates();

        const certificate = certificates.find((item: any) => {
          const certificateSlug = String(item.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          return certificateSlug === slug;
        });

        if (certificate) {
          const normalizedCertificate = {
            ...certificate,
            id: Number(certificate.id),
            title: certificate.title || '',
            subtitle: certificate.subtitle || '',
            description: certificate.description || '',
            bannerImage: certificate.bannerImage || '',
            certificateImage: certificate.certificateImage || '',
            certificateType: certificate.certificateType || '',
            ctaApply: certificate.ctaApply || '',
            ctaRates: certificate.ctaRates || '',
            benefits: certificate.benefits || { title: '', items: [] },
            investment: certificate.investment || { title: '', subtitle: '', details: [], imageUrl: '' },
            rates: certificate.rates || { title: '', items: [] },
            requirements: certificate.requirements || { title: '', items: [] },
            depositRates: certificate.depositRates || { title: '', items: [], validFrom: '' },
            faq: certificate.faq || { title: '', items: [] },
            slug: certificate.slug || '',
          };

          setCertificateData(normalizedCertificate);
        } else {
          setError('Certificado no encontrado');
        }
      } catch (err) {
        setError('Error al cargar los datos del certificado');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCertificateData();
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

  const renderListItems = (items: any) => {
    if (!Array.isArray(items)) return null;

    return items.map((item: any, index: number) => (
      <li key={index}>
        {typeof item === 'string'
          ? item
          : item?.text || item?.title || item?.name || 'Elemento'}
      </li>
    ));
  };

  const renderFaqItems = (items: any) => {
    if (!Array.isArray(items)) return null;

    return items.map((item: any, index: number) => (
      <li key={index}>
        {typeof item === 'string'
          ? item
          : `${item?.question || 'Pregunta'}${item?.answer ? `: ${item.answer}` : ''}`}
      </li>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando certificado...</p>
        </div>
      </div>
    );
  }

  if (error || !certificateData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Certificado no encontrado'}</p>
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
      {certificateData.bannerImage && (
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={certificateData.bannerImage}
            alt={certificateData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {certificateData.title}
          </h1>

          {certificateData.subtitle && (
            <h2 className="text-xl text-gray-700 mb-4">{certificateData.subtitle}</h2>
          )}

          <p className="text-gray-700 mb-6">{certificateData.description}</p>

          {certificateData.certificateImage && (
            <img
              src={certificateData.certificateImage}
              alt={certificateData.title}
              className="w-full max-w-xl mb-6 rounded-lg shadow"
            />
          )}

          {certificateData.benefits?.title && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{certificateData.benefits.title}</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {renderListItems(certificateData.benefits.items)}
              </ul>
            </div>
          )}

          {certificateData.investment?.title && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{certificateData.investment.title}</h2>

              {certificateData.investment.subtitle && (
                <p className="text-gray-700 mb-3">{certificateData.investment.subtitle}</p>
              )}

              <ul className="list-disc pl-5 text-gray-700">
                {renderListItems(certificateData.investment.details)}
              </ul>

              {certificateData.investment.imageUrl && (
                <img
                  src={certificateData.investment.imageUrl}
                  alt={certificateData.title}
                  className="w-full max-w-xl mt-4 rounded-lg shadow"
                />
              )}
            </div>
          )}

          {certificateData.rates?.title && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{certificateData.rates.title}</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {renderListItems(certificateData.rates.items)}
              </ul>
            </div>
          )}

          {certificateData.requirements?.title && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{certificateData.requirements.title}</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {renderListItems(certificateData.requirements.items)}
              </ul>
            </div>
          )}

          {certificateData.depositRates?.title && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{certificateData.depositRates.title}</h2>

              {certificateData.depositRates.validFrom && (
                <p className="text-gray-600 mb-2">
                  Vigente desde: {certificateData.depositRates.validFrom}
                </p>
              )}

              <ul className="list-disc pl-5 text-gray-700">
                {renderListItems(certificateData.depositRates.items)}
              </ul>
            </div>
          )}

          {certificateData.faq?.title && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">{certificateData.faq.title}</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {renderFaqItems(certificateData.faq.items)}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CertificateDetail;

