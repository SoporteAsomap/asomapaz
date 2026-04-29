import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { accountsService } from '@/api';
import type { IAccountData, IAccountBenefit } from '@/interfaces';

const AccountDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [accountData, setAccountData] = useState<IAccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setLoading(true);
        setError(null);

        const accounts = await accountsService.getAllAccounts();

        const account = accounts.find((acc: any) => {
          const accountSlug = acc.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

          return accountSlug === slug;
        });

        if (account) {
          const normalizedBenefits: IAccountBenefit[] = Array.isArray(account.benefits)
            ? account.benefits.map((benefit: any) => ({
                icon: benefit?.icon || '',
                text: benefit?.text || benefit?.title || '',
              }))
            : [];

          const normalizedAccount: IAccountData = {
            ...account,
            id: Number(account.id),
            bannerImage: account.bannerImage || '',
            accountImage: account.accountImage || '',
            benefits: normalizedBenefits,
          };

          setAccountData(normalizedAccount);
        } else {
          setError('Cuenta no encontrada');
        }
      } catch (err) {
        setError('Error al cargar los datos de la cuenta');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchAccountData();
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
          <p className="text-gray-600">Cargando cuenta...</p>
        </div>
      </div>
    );
  }

  if (error || !accountData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Cuenta no encontrada'}</p>
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
      {accountData.bannerImage && (
        <div className="w-full h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={accountData.bannerImage}
            alt={accountData.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {accountData.title}
          </h1>

          <p className="text-gray-700 mb-6">{accountData.description}</p>

          {accountData.accountImage && (
            <img
              src={accountData.accountImage}
              alt={accountData.title}
              className="w-full max-w-xl mb-6 rounded-lg shadow"
            />
          )}

          {accountData.features?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Características</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {accountData.features.map((feature: string, index: number) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {accountData.requirements?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Requisitos</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {accountData.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {accountData.benefits?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Beneficios</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {accountData.benefits.map((benefit: IAccountBenefit, index: number) => (
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

export default AccountDetail;

