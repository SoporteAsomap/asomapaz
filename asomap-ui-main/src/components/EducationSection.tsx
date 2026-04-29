import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IEducationSectionProps } from '@interfaces';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

const EducationSection: React.FC<IEducationSectionProps> = ({ data }) => {
    const navigate = useNavigate();
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
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

    const handleItemClick = () => {
        navigate('/orientacion-financiera/consejos-ahorro');
    };

    const handleButtonClick = () => {
        navigate('/orientacion-financiera/consejos-ahorro');
    };

    return (
        <motion.div 
            className="bg-white py-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
        >
            <div className="container mx-auto px-4">
                <motion.div variants={itemVariants} className="text-center">
                    <motion.h2 
                        className="text-lg font-semibold text-neutral-100 mb-2"
                        variants={itemVariants}
                    >
                        {data.title}
                    </motion.h2>
                    <motion.h3 
                        className="text-3xl font-bold text-primary mb-8"
                        variants={itemVariants}
                    >
                        {data.subtitle}
                    </motion.h3>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        slidesPerView={1}
                        autoplay={{ 
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 1,
                            },
                            768: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                        className="education-swiper"
                    >
                        {(data.educationItems ?? []).map((item, index) => (
                            <SwiperSlide key={index}>
                                <motion.div 
                                    className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                                    onClick={handleItemClick}
                                >
                                    <div className="w-full h-64 relative overflow-hidden">
                                        <img 
                                            src={item.image} 
                                            alt={item.alt} 
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <p className="text-white text-lg font-semibold mb-2">{item.description}</p>
                                        <div className="w-12 h-1 bg-orange-500 rounded-full transition-all duration-300 group-hover:w-24"></div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </motion.div>

                <motion.div 
                    variants={itemVariants}
                    className="mt-12"
                >
                    <button
                        onClick={handleButtonClick}
                        className="w-full text-left focus:outline-none group"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-orange-500 group-hover:underline transition-all duration-300">
                                {data.footerText}
                            </span>
                            <div className="flex-grow flex justify-center">
                                <div className="w-3 h-3 rounded-full bg-orange-500 transition-all duration-300 group-hover:scale-125"></div>
                            </div>
                            <span className="invisible">Espaciador</span>
                        </div>
                        <div className="mt-2 h-0.5 bg-orange-500 transition-all duration-300 group-hover:h-1"></div>
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default EducationSection;
