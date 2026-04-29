import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductsCard, DebitCardPromo, EducationSection, PekeAccountSummary } from '@components';
import { debitCardPromoService, educationSectionService, pekeAccountSummaryService, productSectionService, sliderService } from '@/api';
import type { IDebitCardPromoData, IEducationSectionProps, IPekeAccountSummaryData, IProductSectionData, SliderItemAPI } from '@/interfaces';
import { Slider } from '@components/ui';
import { FiArrowUp } from 'react-icons/fi';

const Home: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [debitCardData, setDebitCardData] = useState<IDebitCardPromoData | null>(null);
  const [educationData, setEducationData] = useState<IEducationSectionProps['data'] | null>(null);
  const [pekeAccountData, setPekeAccountData] = useState<IPekeAccountSummaryData | null>(null);
  const [productData, setProductData] = useState<IProductSectionData | null>(null);
  const [sliderData, setSliderData] = useState<SliderItemAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [educationLoading, setEducationLoading] = useState(true);
  const [pekeAccountLoading, setPekeAccountLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);
  const [sliderLoading, setSliderLoading] = useState(true);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
        ease: "easeOut"
      }
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      setShowScrollTop(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchDebitCardData = async () => {
      try {
        setLoading(true);
        const data = await debitCardPromoService.getDebitCardPromo();
        setDebitCardData(data);
      } catch (error) {
        // No mostrar nada si la API falla
        setDebitCardData(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchEducationData = async () => {
      try {
        setEducationLoading(true);
        const data = await educationSectionService.getEducationSection();
        setEducationData(data);
      } catch (error) {
        // No mostrar nada si la API falla
        setEducationData(null);
      } finally {
        setEducationLoading(false);
      }
    };

    const fetchPekeAccountData = async () => {
      try {
        setPekeAccountLoading(true);
        const data = await pekeAccountSummaryService.getPekeAccountSummary();
        setPekeAccountData(data);
      } catch (error) {
        // No mostrar nada si la API falla
        setPekeAccountData(null);
      } finally {
        setPekeAccountLoading(false);
      }
    };

    const fetchProductData = async () => {
      try {
        setProductLoading(true);
        const data = await productSectionService.getProductSection();
        setProductData(data);
      } catch (error) {
        // No mostrar nada si la API falla
        setProductData(null);
      } finally {
        setProductLoading(false);
      }
    };

    const fetchSliderData = async () => {
      try {
        setSliderLoading(true);
        const data = await sliderService.getSlider();
        setSliderData(data);
      } catch (error) {
        // No usar mock, solo manejar el error
        setSliderData([]);
      } finally {
        setSliderLoading(false);
      }
    };

    fetchDebitCardData();
    fetchEducationData();
    fetchPekeAccountData();
    fetchProductData();
    fetchSliderData();
  }, []);

  return (
    <div className='flex flex-col min-h-screen font-sans'>
      {/* Section Carousel */}
      {sliderData.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="relative -mt-[calc(32px+56px)]"
        >
          {sliderLoading ? (
            <div className="flex justify-center items-center h-96 bg-gray-100">
              <div className="text-gray-500">Cargando slider...</div>
            </div>
          ) : (
            <Slider
              autoSlide={true}
              autoSlideInterval={3000}
              slides={sliderData}
              fullScreen={false}
              className="w-full"
              minHeight="400px"
            />
          )}
        </motion.div>
      )}

      {/* Section Products */}
      <div className="mt-8 sm:mt-12 lg:mt-16">
        {productLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando...</div>
          </div>
        ) : productData ? (
          <ProductsCard 
            products={productData.products}
            sectionTitle={productData.section?.title || "Nuestros Productos ubicando datos"}
            sectionSubtitle={productData.section?.subtitle || "Descubre las mejores opciones para ti"}
            buttonText={productData.buttonText || "Conocer Más"}
          />
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">No hay productos disponibles en este momento</div>
          </div>
        )}
      </div>

      {/* Section Public Asomap */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        className="mt-8 sm:mt-12 lg:mt-16"
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando...</div>
          </div>
        ) : debitCardData ? (
          <DebitCardPromo data={debitCardData} />
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">No hay promociones de tarjeta de débito disponibles</div>
          </div>
        )}
      </motion.div>

      {/* Section Education */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        className="mt-8 sm:mt-12 lg:mt-16"
      >
        {educationLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando...</div>
          </div>
        ) : educationData ? (
          <EducationSection data={educationData} />
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">No hay contenido educativo disponible</div>
          </div>
        )}
      </motion.div>

      {/* Section Summary Cuenta Pekes */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
        className="mt-8 sm:mt-12 lg:mt-16 mb-12 sm:mb-16 lg:mb-20"
      >
        {pekeAccountLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Cargando...</div>
          </div>
        ) : pekeAccountData ? (
          <PekeAccountSummary 
            title={pekeAccountData.title}
            description={pekeAccountData.description}
            buttonText={pekeAccountData.button_text}
            button_url={pekeAccountData.button_url}
            imageUrl={pekeAccountData.image_url}
            imageAlt={pekeAccountData.image_alt}

          />
        ) : (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">No hay información de cuenta disponible</div>
          </div>
        )}
      </motion.div>

      {/* Botón Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-primary hover:bg-primary-accent text-white rounded-full shadow-lg transition-colors duration-300 z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
