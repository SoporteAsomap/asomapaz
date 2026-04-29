import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AboutResponse } from '@/interfaces';
import { aboutService } from '@/api';
import { FaHandHoldingHeart } from 'react-icons/fa';
import { Spinner } from '@components/ui';


const AboutUs: React.FC = () => {
  const location = useLocation();
  const [aboutData, setAboutData] = useState<AboutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await aboutService.getAbout();
        setAboutData(data as AboutResponse);
      } catch (error) {
        setError('Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    const hash = location.hash;
    if (hash && !loading) {
      const element = document.querySelector(hash);
      if (element) {
        setTimeout(() => {
          const headerHeight = 32;
          const navbarHeight = 56;
          const offset = headerHeight + navbarHeight + 24;
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location.hash, loading, aboutData]);

  // Spinner component for full-page loading
  if (loading) {
    return (
      <div
        id="quienes-somos"
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm"
      >
        <Spinner className="w-16 h-16 text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">
      {error}
    </div>;
  }

  if (!aboutData) {
    return null;
  }

  const { hero, quienesSomos, nuestraHistoria, mision, vision, valores, consejoDirectores } = aboutData;

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="font-sans bg-white">
      {/* Hero Banner */}
      <motion.div
        className="relative -mt-[90px] bg-gradient-to-b from-white to-blue-50/30 z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="relative h-[120px] bg-[#FBE3D2] py-6 rounded-b-[50px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="container relative px-6 mx-auto flex flex-col items-center justify-center h-full text-center">
            <motion.h1
              className="text-[#2B4BA9] text-2xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {hero.title}
            </motion.h1>
            <motion.p
              className="text-gray-600 text-sm mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {hero.description}
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      <section id="quienes-somos" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-16">
            {/* Quienes Somos */}
            <motion.div
              className="mb-16 sm:mb-20 lg:mb-24 scroll-mt-28"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-primary"
                variants={fadeInUp}
              >
                {quienesSomos.title}
              </motion.h2>
              <div className="grid items-stretch gap-8 sm:gap-12 md:grid-cols-2">
                <motion.div
                  className="flex flex-col justify-center space-y-4"
                  variants={fadeInUp}
                >
                  {/* {quienesSomos.paragraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      variants={cardVariants}
                      className="text-base sm:text-lg leading-relaxed text-gray-600"
                    >
                      {paragraph}
                    </motion.p>
                  ))} */}

                    <motion.div
                      variants={cardVariants}
                      className="text-base sm:text-lg leading-relaxed text-gray-600"
                      dangerouslySetInnerHTML={{ __html: quienesSomos.paragraphs }}
                    />

                </motion.div>
                <motion.div
                  className="relative aspect-w-16 aspect-h-9"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <img
                    src={quienesSomos.imageSrc}
                    alt={quienesSomos.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Nuestra Historia */}
            <motion.div
              id="historia"
              className="mb-16 sm:mb-20 lg:mb-24 scroll-mt-28"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-primary"
                variants={fadeInUp}
              >
                {nuestraHistoria.title}
              </motion.h2>
              <div className="grid items-stretch gap-8 sm:gap-12 md:grid-cols-2">
                <motion.div
                  className="flex flex-col justify-center space-y-4"
                  variants={fadeInUp}
                >
                    <motion.div
                      variants={cardVariants}
                      className="text-base sm:text-lg leading-relaxed text-gray-600"
                      dangerouslySetInnerHTML={{ __html: nuestraHistoria.paragraphs }}
                    />
                </motion.div>
                <motion.div
                  className="relative aspect-w-16 aspect-h-9"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <img
                    src={nuestraHistoria.imageSrc}
                    alt={nuestraHistoria.imageAlt}
                    className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-lg"
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Misión y Visión */}
            <motion.div
              id="mision-vision"
              className="mb-16 sm:mb-20 lg:mb-24 scroll-mt-28"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg"
                  variants={cardVariants}
                >
                  <div className="flex flex-col items-center">
                    <FaHandHoldingHeart />
                    <h3 className="text-xl font-semibold text-primary mt-4 mb-4">{mision.title}</h3>
                  </div>
                  <div className="text-gray-600">
                    {Array.isArray(mision.description) ? (
                      mision.description.map((description, index) => (
                        <motion.div
                          key={index}
                          variants={cardVariants}
                          className="text-base sm:text-lg leading-relaxed text-gray-600"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      ))
                    ) : (
                      <motion.div
                        variants={cardVariants}
                        className="text-base sm:text-lg leading-relaxed text-gray-600"
                        dangerouslySetInnerHTML={{ __html: mision.description }}
                      />
                    )}
                  </div>
                </motion.div>
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg"
                  variants={cardVariants}
                >
                  <div className="flex flex-col items-center">
                    <FaHandHoldingHeart />
                    <h3 className="text-xl font-semibold text-primary mt-4 mb-4">{vision.title}</h3>
                  </div>
                  <div className="text-gray-600">
                    {Array.isArray(vision.description) ? (
                      vision.description.map((description, index) => (
                        <motion.div
                          key={index}
                          variants={cardVariants}
                          className="text-base sm:text-lg leading-relaxed text-gray-600"
                          dangerouslySetInnerHTML={{ __html: description }}
                        />
                      ))
                    ) : (
                      <motion.div
                        variants={cardVariants}
                        className="text-base sm:text-lg leading-relaxed text-gray-600"
                        dangerouslySetInnerHTML={{ __html: vision.description }}
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Valores */}
            <motion.div
              id="valores"
              className="mb-16 sm:mb-20 lg:mb-24 scroll-mt-28"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-primary"
                variants={fadeInUp}
              >
                {valores.title}
              </motion.h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {valores.items.map((valor, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md text-center"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <h3 className="mt-4 text-lg font-semibold text-primary">{valor.title}</h3>
                    <p className="mt-2 text-gray-600">{valor.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Consejo de Directores */}
            <motion.div
              id="consejo-directores"
              className="mb-16 sm:mb-20 lg:mb-24 scroll-mt-28"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.h2
                className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-primary"
                variants={fadeInUp}
              >
                Consejo de Directores
              </motion.h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {consejoDirectores.map((director, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md text-center"
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="mx-auto w-48 h-48 mb-4 rounded-full overflow-hidden">
                      <img
                        src={director.imageSrc}
                        alt={director.imageAlt}
                        className="w-full h-full object-cover"
                        style={{ imageRendering: 'auto' }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-primary">{director.name}</h3>
                    <p className="text-gray-600">{director.position}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;

