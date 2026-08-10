import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { normalizeMediaUrl } from '@/utils/media';
import { Link } from 'react-router-dom';

interface IDebitCardPromoProps {
  data: {
    title: string;
    highlighted_title: string;
    description: string;
    primary_button_text: string;
    secondary_button_text: string;
    primary_button_url: string;
    secondary_button_url: string;
    image_url: string;
    image_alt: string;
  };
}

const DebitCardPromo: React.FC<IDebitCardPromoProps> = ({ data }) => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-primary/5 via-white to-primary/10 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-primary leading-tight">
                {data.title}{' '}
                <span className="text-primary-accent">{data.highlighted_title}</span>
              </h2>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {data.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* <a href={data.primary_button_url} target="_self" rel="noreferrer">
                <Button className="w-full sm:w-auto px-6 py-3 text-white bg-primary hover:bg-primary-accent transition-all duration-300">
                  {data.primary_button_text}
                </Button>
              </a> */}

              {/* <a href={data.secondary_button_url} target="_self" rel="noreferrer">
                <Button className="w-full sm:w-auto px-6 py-3 border border-primary text-primary bg-white hover:bg-primary/5 transition-all duration-300">
                  {data.secondary_button_text}
                </Button>
              </a> */}

              <Link to="/productos/tarjeta/tarjeta-de-debito">
                <Button className="w-full sm:w-auto px-6 py-3 border border-primary text-primary bg-white hover:bg-primary/5 transition-all duration-300">
                  {data.secondary_button_text}
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={normalizeMediaUrl(data.image_url)}
                alt={data.image_alt || 'Tarjeta de débito'}
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DebitCardPromo;
