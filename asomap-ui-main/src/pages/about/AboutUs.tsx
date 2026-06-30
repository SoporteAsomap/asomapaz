import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { AboutResponse } from '@/interfaces';
import { aboutService } from '@/api';
import { FaHandHoldingHeart, FaEye, FaRegLightbulb } from 'react-icons/fa';
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
          const navbarHeight = 68; // Ajustado a la nueva altura de tu navbar
          const offset = headerHeight + navbarHeight + 24;
          window.scrollTo({
            top: element.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location.hash, loading, aboutData]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <Spinner className="w-16 h-16 text-[#2B4BA9]" />
      </div>
    );
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }

  if (!aboutData) return null;

  const { hero, quienesSomos, nuestraHistoria, mision, vision, valores, consejoDirectores } = aboutData;

  // Animaciones más suaves
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const cardHover = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { y: -5, transition: { duration: 0.2 } }
  };

  return (
    <div className="font-sans bg-[#F8FAFC]"> {/* Fondo ligeramente gris/azulado para resaltar las tarjetas blancas */}
      
      {/* Hero Banner Mejorado */}
      <motion.div
        // 1. Jalamos el banner 100px hacia arriba para que se pegue al tope y pase bajo el menú
        className="relative -mt-[100px] z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* 2. Le damos pt-[130px] (Padding Top) para empujar el texto hacia abajo y que el menú no lo tape */}
        <div className="relative bg-gradient-to-r from-[#FBE3D2] to-[#fdf0e6] pt-[50px] pb-12 md:pb-16 shadow-sm overflow-hidden">
          {/* Elemento decorativo de fondo */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-40 blur-3xl"></div>
          
          <div className="container relative px-6 mx-auto flex flex-col items-center justify-center text-center z-10">
            <motion.h1
              className="text-[#2B4BA9] text-3xl sm:text-4xl font-extrabold tracking-tight"
              variants={fadeInUp}
            >
              {hero.title}
            </motion.h1>
            <motion.p
              className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto font-medium"
              variants={fadeInUp}
            >
              {hero.description}
            </motion.p>
          </div>
        </div>
      </motion.div>

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-24">
            
            {/* Quiénes Somos (Imagen a la Derecha) */}
            <motion.div
              id="quienes-somos"
              className="scroll-mt-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="grid items-center gap-10 md:gap-16 md:grid-cols-2">
                <motion.div className="flex flex-col justify-start space-y-6" variants={fadeInUp}>
                  <div className="inline-block">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#2B4BA9] relative inline-block">
                      {quienesSomos.title}
                      {/* Subrayado decorativo */}
                      <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#F58220] rounded-full"></span>
                    </h2>
                  </div>
                  <div
                    className="text-base sm:text-lg leading-relaxed text-gray-600 text-justify"
                    dangerouslySetInnerHTML={{ __html: quienesSomos.paragraphs }}
                  />
                </motion.div>
                
                {/* Imagen con marco 3D decorativo */}
                <motion.div className="relative" variants={fadeInUp}>
                  <div className="absolute inset-0 bg-[#2B4BA9]/10 rounded-2xl transform translate-x-4 translate-y-4"></div>
                  <div className="relative aspect-w-16 aspect-h-10 sm:aspect-h-12 rounded-2xl overflow-hidden shadow-xl border border-white/50">
                    <img src={quienesSomos.imageSrc} alt={quienesSomos.imageAlt} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Nuestra Historia (Imagen a la Izquierda - Z-Pattern) */}
            <motion.div
              id="historia"
              className="scroll-mt-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <div className="grid items-center gap-10 md:gap-16 md:grid-cols-2">
                {/* order-last en móvil, order-first en desktop para invertir el orden */}
                <motion.div className="relative md:order-1 order-2" variants={fadeInUp}>
                  <div className="absolute inset-0 bg-[#F58220]/15 rounded-2xl transform -translate-x-4 translate-y-4"></div>
                  <div className="relative aspect-w-16 aspect-h-10 sm:aspect-h-12 rounded-2xl overflow-hidden shadow-xl border border-white/50">
                    <img src={nuestraHistoria.imageSrc} alt={nuestraHistoria.imageAlt} className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 grayscale hover:grayscale-0" />
                  </div>
                </motion.div>

                <motion.div className="flex flex-col justify-start space-y-6 md:order-2 order-1" variants={fadeInUp}>
                  <div className="inline-block">
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#2B4BA9] relative inline-block">
                      {nuestraHistoria.title}
                      <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#F58220] rounded-full"></span>
                    </h2>
                  </div>
                  <div
                    className="text-base sm:text-lg leading-relaxed text-gray-600 text-justify"
                    dangerouslySetInnerHTML={{ __html: nuestraHistoria.paragraphs }}
                  />
                </motion.div>
              </div>
            </motion.div>

            {/* Misión y Visión (Tarjetas Elevadas) */}
            <motion.div
              id="mision-vision"
              className="scroll-mt-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Misión */}
                <motion.div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(43,75,169,0.08)] transition-shadow duration-300 relative overflow-hidden" variants={cardHover}>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#2B4BA9]"></div>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-[#2B4BA9]/10 rounded-full flex items-center justify-center text-[#2B4BA9] mb-4">
                      <FaRegLightbulb size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2B4BA9]">{mision.title}</h3>
                  </div>
                  <div className="text-gray-600">
                    {Array.isArray(mision.description) ? (
                      mision.description.map((desc, i) => (
                        <div key={i} className="text-base sm:text-lg leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: desc }} />
                      ))
                    ) : (
                      <div className="text-base sm:text-lg leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: mision.description }} />
                    )}
                  </div>
                </motion.div>

                {/* Visión */}
                <motion.div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_8px_30px_rgb(245,130,32,0.08)] transition-shadow duration-300 relative overflow-hidden" variants={cardHover}>
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-[#F58220]"></div>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-16 h-16 bg-[#F58220]/10 rounded-full flex items-center justify-center text-[#F58220] mb-4">
                      <FaEye size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-[#2B4BA9]">{vision.title}</h3>
                  </div>
                  <div className="text-gray-600">
                    {Array.isArray(vision.description) ? (
                      vision.description.map((desc, i) => (
                        <div key={i} className="text-base sm:text-lg leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: desc }} />
                      ))
                    ) : (
                      <div className="text-base sm:text-lg leading-relaxed text-justify" dangerouslySetInnerHTML={{ __html: vision.description }} />
                    )}
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Valores (Grid Moderno con líneas decorativas) */}
            <motion.div
              id="valores"
              className="scroll-mt-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="text-center mb-12">
                <motion.h2 className="text-3xl lg:text-4xl font-bold text-[#2B4BA9] inline-block relative" variants={fadeInUp}>
                  {valores.title}
                  <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-[#2B4BA9]/20 rounded-full"></span>
                </motion.h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {valores.items.map((valor, index) => (
                  <motion.div
                    key={index}
                    className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden cursor-default"
                    variants={cardHover}
                    whileHover="hover"
                  >
                    {/* Efecto de línea que aparece al hacer hover */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#2B4BA9] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                    
                    <div className="w-12 h-12 bg-blue-50 text-[#2B4BA9] rounded-xl flex items-center justify-center mb-5 font-bold text-xl">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{valor.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-justify text-sm sm:text-base">{valor.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Consejo de Directores */}
            <motion.div
              id="consejo-directores"
              className="scroll-mt-32"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <div className="text-center mb-12">
                <motion.h2 className="text-3xl lg:text-4xl font-bold text-[#2B4BA9] inline-block relative" variants={fadeInUp}>
                  Consejo de Directores
                  <span className="absolute -bottom-2 left-1/4 w-1/2 h-1 bg-[#2B4BA9]/20 rounded-full"></span>
                </motion.h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {consejoDirectores.map((director, index) => (
                  <motion.div
                    key={index}
                    className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition-shadow duration-300"
                    variants={cardHover}
                    whileHover="hover"
                  >
                    <div className="relative mx-auto w-40 h-40 mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#2B4BA9] to-[#F58220] animate-spin-slow opacity-10"></div>
                      <img
                        src={director.imageSrc}
                        alt={director.imageAlt}
                        className="w-full h-full object-cover rounded-full p-1 border-2 border-transparent relative z-10 shadow-sm"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{director.name}</h3>
                    <p className="text-[#F58220] font-medium mt-1">{director.position}</p>
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