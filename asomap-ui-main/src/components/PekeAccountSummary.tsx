import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

interface PekeAccountSummaryProps {
    title: string;
    description: string;
    buttonText: string;
    imageUrl: string;
    imageAlt: string;
    button_url: string;
}

const PekeAccountSummary: React.FC<PekeAccountSummaryProps> = ({
    title,
    description,
    buttonText,
    imageUrl,
    imageAlt}) => {
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

    const handleButtonClick = () => {
       // if (button_url) {
           // window.open(button_url, '_blank');
       // } else {
            navigate('/productos/cuenta/cuenta-pekes');
       // }
    };

    return (
        <motion.div 
            className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-white py-20 overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
        >
            <motion.div 
                className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"
                animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                }}
            />
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
                    <motion.div 
                        className="w-full md:w-1/2 text-center md:text-left"
                        variants={itemVariants}
                    >
                        <motion.h2 
                            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
                            variants={itemVariants}
                        >
                            {title}
                        </motion.h2>
                        <motion.p 
                            className="text-lg sm:text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed"
                            variants={itemVariants}
                        >
                            {description}
                        </motion.p>
                        <motion.div variants={itemVariants}>
                            <Button
                                onClick={handleButtonClick}
                                className="inline-flex items-center px-8 py-3 text-base font-medium text-primary bg-white rounded-lg shadow-lg hover:bg-orange-50 transform hover:scale-105 transition-all duration-300"
                            >
                                {buttonText}
                                <motion.svg 
                                    className="w-5 h-5 ml-2" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                    animate={{
                                        x: [0, 5, 0],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                    }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </motion.svg>
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div 
                        className="w-full md:w-1/2"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="absolute -inset-1 bg-gradient-to-r from-white to-orange-400 rounded-2xl blur opacity-30"
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                            <img
                                src={imageUrl}
                                alt={imageAlt}
                                className="relative rounded-xl shadow-2xl w-full transform transition-transform duration-300"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default PekeAccountSummary;