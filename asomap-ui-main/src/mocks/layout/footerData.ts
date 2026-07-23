// footerData.ts
import { FaFacebookF, FaYoutube, FaLinkedinIn, FaWhatsapp, FaCopyright } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaXTwitter } from "react-icons/fa6";
import { FaMapMarkerAlt, FaInstagram } from 'react-icons/fa';
import commitmentPdf from '@/assets/Declaracion_de_Compromiso_GFXC.pdf';
import Logo from '@assets/Logo.svg';
import SSB from '@assets/SB.jpg';

export interface FooterItem {
    icon?: React.ElementType;
    text: string;
    to?: string;
    isExternalLink?: boolean;
}

export interface CertificationItem {
    image: string;
    alt: string;
    url?: string;
    className?: string;
}

export interface FooterSection {
    title: string;
    items?: FooterItem[];
    address?: string;
    link?: string;
    url?: string;
    icons?: { icon: React.ElementType; className?: string; url?: string }[];
}

export interface FooterData {
    sections: Record<string, FooterSection>;
    company: {
        name: string;
        shortName: string;
        logo: string;
        certifications: CertificationItem[];
        copyright: {
            text: string;
            rights: string;
            icon?: React.ElementType;
        };
    };
    location: {
        title: string;
        icon: React.ElementType;
    };
}

export const footerData: FooterData = {
    sections: {
        about: {
            title: "Acerca de Nosotros",
            items: [
                {
                    text: "Quiénes Somos",
                    to: "/nosotros/quienes-somos#quienes-somos"
                },
                {
                    text: "Tarifario de Servicios",
                    to: "/prousuario/tarifario-productos-servicios"
                },
                {
                    text: "Consejo de Directores",
                    to: "/nosotros/quienes-somos#consejo-directores"
                },
                {
                    text: "Deberes y Derechos",
                    to: "/prousuario/derechos-deberes"
                },
                {
                    text: 'Declaración de compromiso',
                    to: commitmentPdf, 
                    isExternalLink: true, 
                },
            ]
        },
        services: {
            title: "Servicios",
            items: [
                {
                    text: "Buzón de Sugerencias",
                    to: "/prousuario/buzon-sugerencias"
                },
                {
                    text: "Reporte de Fraude",
                    to: "/prousuario/reporte-fraude"
                },
                {
                    text: "Solicitud de Reclamación",
                    to: "/prousuario/solicitud-reclamacion"
                },
                {
                    text: "Cuentas Abandonadas",
                    to: "/prousuario/cuentas-abandonadas"
                },
                {
                    text: "Contratos de Adhesión",
                    to: "/prousuario/contratos-cuentas"
                }
            ]
        },
        contact: {
            title: "Contáctanos",
            items: [
                { 
                    icon: FaWhatsapp, 
                    text: "Chatear Por WhatsApp",
                    to: "https://wa.me/8095782321",
                    isExternalLink: true
                },
                { 
                    icon: MdEmail, 
                    text: "Onicanal@asomap.com.do",
                    to: "mailto:Onicanal@asomap.com.do",
                    isExternalLink: true
                }
            ]
        },
        follow: {
            title: "Síguenos",
            icons: [
                {
                    icon: FaInstagram,
                    className: "text-2xl text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer",
                    url: "https://instagram.com/asomaprd"
                },
                { 
                    icon: FaFacebookF, 
                    className: "text-2xl text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer",
                    url: "https://facebook.com/asomaprd"
                },
                { 
                    icon: FaXTwitter, 
                    className: "text-2xl text-gray-600 hover:text-blue-400 transition-colors duration-300 cursor-pointer",
                    url: "https://twitter.com/asomaprd"
                },
                { 
                    icon: FaYoutube, 
                    className: "text-2xl text-gray-600 hover:text-red-600 transition-colors duration-300 cursor-pointer",
                    url: "https://www.youtube.com/@Asomaprd"
                },
                { 
                    icon: FaLinkedinIn, 
                    className: "text-2xl text-gray-600 hover:text-blue-700 transition-colors duration-300 cursor-pointer",
                    url: "https://linkedin.com/company/asomaprd"
                }
            ],
            address: "Oficina Principal: Calle Independencia esquina José María Michel, Moca, Provincia Espaillat.",
            link: "Ver todas las Oficinas",
            url: "/locations/map"
        }
    },
    company: {
        name: "Asociación Mocana de Ahorros y Préstamos",
        shortName: "ASOMAP",
        logo: Logo,
        copyright: {
            text: "Asociación Mocana de Ahorros y Préstamos",
            rights: "Todos los derechos reservados",
            icon: FaCopyright
        },
        certifications: [
            {
                image: SSB,
                alt: "SSB Logo",
                url: "https://sb.gob.do/supervisados/entidades-de-intermediacion-financiera/asociacion-mocana/",
                className: "w-full h-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"
            },
            {
                image: "https://certificaciones.uaf.gob.do/certificados/UAF00151OKME.png",
                alt: "UAF Logo",
                url: "https://sb.gob.do/supervisados/entidades-de-intermediacion-financiera/asociacion-mocana/",
                className: "w-full h-full object-contain p-2 transform group-hover:scale-110 transition-transform duration-300"
            }
        ]
    },
    location: {
        title: "Ubícanos",
        icon: FaMapMarkerAlt
    }
};
