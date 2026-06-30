import React from 'react';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import { IProduct } from '@interfaces';
import { Button } from '@/components/ui';
import { normalizeMediaUrl } from '@/utils/media';
// 1. Importamos useNavigate para la navegación
import { useNavigate } from 'react-router-dom';

interface IProductsCardProps {
  products: IProduct[];
  sectionTitle?: string;
  sectionSubtitle?: string;
  buttonText?: string;
}

const ProductsCard: React.FC<IProductsCardProps> = ({
  products,
  sectionTitle = "Nuestros Productos",
  sectionSubtitle = "Descubre las mejores opciones para ti",
  buttonText = "Conocer Más"
}) => {
  // 2. Inicializamos el hook de navegación
  const navigate = useNavigate();

  const getImage = (url?: string) => normalizeMediaUrl(url || "");

  // 3. Función lógica para redirigir
  const handleNavigation = (title: string) => {
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('préstamo')) {
      navigate('/productos/prestamo/prestamo-de-consumo');
    } else if (lowerTitle.includes('ahorro')) {
      navigate('/productos/cuenta/cuenta-clasica');
    } else if (lowerTitle.includes('tarjeta')) {
      navigate('/productos/tarjeta/tarjeta-de-debito');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="relative bg-gradient-to-b from-white to-gray-50/50 py-16 sm:py-20 md:py-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      <div className="container px-4 mx-auto relative z-10">
        <motion.div
          className="text-center mb-12 md:mb-16"
          variants={cardVariants}
        >
          <motion.h1
            className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary"
            variants={cardVariants}
          >
            {sectionTitle}
          </motion.h1>
          <motion.h2
            className="text-xl sm:text-2xl text-neutral-100"
            variants={cardVariants}
          >
            {sectionSubtitle}
          </motion.h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          variants={containerVariants}
        >
          {products.map((product: IProduct) => (
            <motion.div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col w-full max-w-[400px] mx-auto transform hover:-translate-y-2"
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="relative h-[340px] overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={getImage(product.image)}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <motion.div
                className="flex flex-col justify-between flex-grow p-6 sm:p-8"
                variants={cardVariants}
              >
                <div>
                  <motion.h3
                    className="text-2xl font-bold mb-3 text-primary"
                    variants={cardVariants}
                  >
                    {product.title}
                  </motion.h3>
                  <motion.p
                    className="text-base text-neutral-100 leading-relaxed"
                    variants={cardVariants}
                  >
                    {product.description}
                  </motion.p>
                </div>

                <motion.div
                  className="flex items-center justify-between mt-6"
                  variants={cardVariants}
                >
                  {/* 4. Aplicamos el onClick que llama a la función de navegación */}
                  <Button 
                    onClick={() => handleNavigation(product.title)}
                    className="px-6 py-3 text-sm font-medium text-white bg-primary-accent rounded-lg shadow-lg hover:bg-primary transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    {buttonText}
                  </Button>

                  {/* <motion.button
                    className="text-primary hover:text-primary-accent transition-colors duration-300"
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaLightbulb size={24} />
                  </motion.button> */}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductsCard;