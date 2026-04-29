import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { loansService } from '@/api';
import type { ILoanData } from '@/interfaces';

const LoanDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loanData, setLoanData] = useState<ILoanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        setLoading(true);
        setError(null);

        const loans = await loansService.getAllLoans();

        const loan = loans.find((item: any) => {
          const loanSlug = String(item.title || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          return loanSlug === slug;
        });

        if (loan) {
          const normalizedLoan: ILoanData = {
            ...loan,
            id: Number(loan.id),
            title: loan.title || '',
            description: loan.description || '',
            bannerImage: loan.bannerImage || '',
            loanType: String(loan.loanType || ''),
            details: Array.isArray(loan.details) ? loan.details : [],
            requirementsTitle: loan.requirementsTitle || '',
            requirements: Array.isArray(loan.requirements) ? loan.requirements : [],
            slug: loan.slug || '',
          };

          setLoanData(normalizedLoan);
        } else {
          setError('Préstamo no encontrado');
        }
      } catch (err) {
        setError('Error al cargar los datos del préstamo');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLoanData();
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
          <p className="text-gray-600">Cargando préstamo...</p>
        </div>
      </div>
    );
  }

  if (error || !loanData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Préstamo no encontrado'}</p>
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
      {loanData.bannerImage && (
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={loanData.bannerImage}
            alt={loanData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {loanData.title}
          </h1>

          <p className="text-gray-700 mb-6">{loanData.description}</p>

          {loanData.details?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Detalles</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {loanData.details.map((detail: string, index: number) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            </div>
          )}

          {loanData.requirements?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">
                {loanData.requirementsTitle || 'Requisitos'}
              </h2>
              <ul className="list-disc pl-5 text-gray-700">
                {loanData.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default LoanDetail;

