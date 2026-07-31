import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUserLock, FaKey, FaCheckCircle } from 'react-icons/fa';

const PrivacyPolicy: React.FC = () => {

  // Efecto para que la página cargue siempre en la parte superior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Animaciones reutilizadas de tu diseño base
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

  const recomendaciones = [
    "Proteja sus credenciales de acceso, pues como titular de la cuenta, usted es responsable de todas las operaciones generadas desde este canal.",
    "Al momento de crear su nombre de usuario y contraseña haga combinaciones de números y letras con un mínimo de diez (10) caracteres incluyendo caracteres especiales.",
    "No se recomienda usar en la contraseña sus datos personales (nombres, apellidos, teléfono, cédula, edad), así como los de sus relacionados, las fechas importantes y números o letras repetidas.",
    "Se recomienda memorizar su contraseña, nunca la escriba ni la almacene en archivos electrónicos.",
    "Es de vital importancia modificar su contraseña periódicamente.",
    "No utilice redes o computadoras públicas para realizar operaciones en la Banca por Internet.",
    "ASOMAP nunca le solicitará que facilite su nombre de usuario o contraseña. En sentido general, jamás envíe información confidencial por correo electrónico o cualquier otra vía de comunicación, o la divulgue por teléfono a personas desconocidas o de dudosa procedencia."
  ];

  return (
    <div className="font-sans bg-[#F8FAFC] min-h-screen">
      
     {/* Hero Banner Ajustado */}
      <motion.div
        className="relative -mt-[100px] z-10"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* REDUJE EL PADDING: pt-[120px] (antes 150) y pb-10 md:pb-12 (antes pb-16 md:pb-20) */}
        <div className="relative bg-gradient-to-r from-[#FBE3D2] to-[#fdf0e6] pt-[120px] pb-10 md:pb-12 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-40 blur-3xl"></div>
          
          <div className="container relative px-6 mx-auto flex flex-col items-center justify-center text-center z-10">
            {/* REDUJE EL MARGEN INFERIOR Y EL TAMAÑO DEL ÍCONO */}
            <motion.div variants={fadeInUp} className="mb-2 text-[#F58220]">
              <FaShieldAlt size={36} />
            </motion.div>
            <motion.h1
              className="text-[#2B4BA9] text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight"
              variants={fadeInUp}
            >
              Política de Privacidad por Internet
            </motion.h1>
            <motion.p
              className="text-gray-600 text-sm sm:text-base mt-3 max-w-2xl mx-auto font-medium"
              variants={fadeInUp}
            >
              Conozca cómo recopilamos, usamos y protegemos su información para garantizar la máxima seguridad en sus transacciones en línea.
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Contenido Principal */}
      <section className="py-12 sm:py-16 lg:py-20 -mt-8 relative z-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
          <motion.div 
            className="space-y-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            
            {/* Introducción */}
            <motion.div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100" variants={fadeInUp}>
              <p className="text-gray-600 leading-relaxed text-lg text-justify">
                Esta Política de Privacidad por Internet explica cómo recopilamos, compartimos, usamos y protegemos la información cuando usted visita o usa este servicio por Internet. La seguridad de nuestros clientes es un valor de vital importancia, por esta razón, contamos con políticas y controles de Seguridad Cibernética y de la información con la finalidad de proteger la información de todos nuestros relacionados, a través de sistemas de seguridad avanzados, garantizando la confidencialidad de sus conexiones y transacciones; así como se utilizan mecanismos de encriptación para todas las comunicaciones en nuestros sistemas.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Uso de la información */}
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group"
                variants={cardHover}
                whileHover="hover"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#2B4BA9] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-[#2B4BA9]/10 rounded-xl flex items-center justify-center text-[#2B4BA9]">
                    <FaUserLock size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2B4BA9]">¿Cómo se utiliza la información?</h2>
                </div>
                <div className="space-y-4 text-gray-600 text-justify leading-relaxed">
                  <p>La información solicitada se utilizará con el único fin de mejorar nuestro servicio. Los datos personales recabados en el aplicativo se utilizarán con la finalidad de proporcionar el servicio solicitado.</p>
                  <p>La información obtenida por medio de la aplicación no será compartida con ningún otro usuario/socio de la institución.</p>
                  <p>El canal de transmisión de información entre usted y la institución utiliza el protocolo de comunicación SSL (Secure Sockets Layer) basada en tecnología de encriptación. Este ambiente seguro, ayuda a proteger la confidencialidad de sus datos cuando realice operaciones online en nuestro sitio.</p>
                </div>
              </motion.div>

              {/* Encriptación */}
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group"
                variants={cardHover}
                whileHover="hover"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-[#F58220] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-[#F58220]/10 rounded-xl flex items-center justify-center text-[#F58220]">
                    <FaKey size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2B4BA9]">Encriptación de Datos</h2>
                </div>
                <div className="text-gray-600 text-justify leading-relaxed">
                  <p>La encriptación de datos es un mecanismo por el cual, la información intercambiada entre el cliente y la Entidad se transforma en una codificación ilegible, con una secuencia de caracteres de lenguaje particular, que esconden el significado real de la información.</p>
                </div>
              </motion.div>
            </div>

            {/* Recomendaciones de Seguridad */}
            <motion.div className="bg-white p-8 sm:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100" variants={fadeInUp}>
              <h2 className="text-3xl font-bold text-[#2B4BA9] mb-8 relative inline-block">
                Recomendaciones de seguridad
                <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-[#F58220] rounded-full"></span>
              </h2>
              
              <ul className="space-y-5">
                {recomendaciones.map((rec, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start space-x-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-[#F58220] w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <p className="text-gray-600 leading-relaxed text-justify">
                      {rec}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;