import ImageCuentaPeke from '@assets/images/loans/CuentaPekes.jpg';
import ImageCuentaSpecial from '@assets/images/loans/CuentaEspecial.jpg';
import ImageCuentaSanIdeal from '@assets/images/loans/CuentaSanIdeal.jpg';
import ImageCuentaOrderPayment from '@assets/images/loans/OrdenPago.jpg';
import {
    FiDollarSign,
    FiShield,
    FiMessageSquare,
    FiFileText,
    FiAlertTriangle,
    FiArchive,
    FiFile,
    FiTrendingUp,
    FiBook,
    FiCreditCard,
    FiAward,
    FiUsers,
    FiClock,
    FiTarget,
    FiCompass,
    FiBookOpen
} from 'react-icons/fi';
import { IoCardSharp } from "react-icons/io5";

import { MainNavItem, IButtonLink } from '@interfaces';

export const aboutItems: MainNavItem[] = [
    {
        text: "Quienes Somos",
        icon: FiUsers,
        to: "/nosotros/quienes-somos#quienes-somos"
    },
    {
        text: "Historia",
        icon: FiClock,
        to: "/nosotros/quienes-somos#historia"
    },
    {
        text: "Misión y Visión",
        icon: FiTarget,
        to: "/nosotros/quienes-somos#mision-vision"
    },
    {
        text: "Valores",
        icon: FiCompass,
        to: "/nosotros/quienes-somos#valores"
    },
    {
        text: "Consejo de directores",
        icon: FiUsers,
        to: "/nosotros/quienes-somos#consejo-directores"
    },
    {
        text: "Apoyo a la Comunidad ",
        icon: FiUsers,
        to: "/nosotros/apoyo-comunitario"
    },
    {
        text: "Estados Financieros",
        icon: FiClock,
        to: "/nosotros/estados-financieros"
    },
    {
        text: "Memorias ",
        icon: FiTarget,
        to: "/nosotros/recuerdos"
    },
    {
        text: "Políticas ",
        icon: FiCompass,
        to: "/nosotros/politicas"
    }
];

export const productItems: MainNavItem[] = [
    {
        text: "Cuentas",
        icon: FiDollarSign,
        subItems: [
            { text: "Cuenta Física Clásica", href: "/productos/cuenta/cuenta-fisica-clasica", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
            { text: "Cuenta Pekes", href: "/productos/cuenta/cuenta-pekes", image: ImageCuentaPeke },
            { text: "Cuenta Clásica", href: "/productos/cuenta/cuenta-clasica", image: ImageCuentaOrderPayment },
            { text: "Cuenta Corriente", href: "/productos/cuenta/cuenta-corriente", image: ImageCuentaSpecial },
            { text: "Cuenta de Ahorros Premium", href: "/productos/cuenta/cuenta-de-ahorros-premium", image: ImageCuentaSanIdeal },
        ],
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
        text: "Tarjetas",
        icon: FiCreditCard,
        subItems: [
            { text: "Tarjeta de Débito", href: "/productos/tarjeta/tarjeta-de-debito", image: "https://images.unsplash.com/photo-1601597111158-f1446042c8fc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
        ],
        image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
        text: "Préstamos",
        icon: FiTrendingUp,
        to: "/productos/prestamos",
        subItems: [
            { text: "Préstamo Consumo", href: "/productos/prestamos-consumo", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
            { text: "Préstamo Comercial", href: "/productos/prestamos-comerciales", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
            { text: "Préstamo Hipotecario", href: "/productos/prestamos-hipotecarios", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
        ],
        image: "https://images.unsplash.com/photo-1554224155-8947307dabb2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
        text: "Certificados",
        icon: FiAward,
        subItems: [
            { text: "Certificado Financiero", href: "/productos/certificado-financiero", image: "https://images.unsplash.com/photo-1611095566888-f1446042c8fc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
        ],
        image: "https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    }

];

const newsItems: MainNavItem[] = [
    {
        text: "Noticias",
        icon: FiFileText,
        to: "/novedades/ultimas-noticias"
    },
    {
        text: "Promociones",
        icon: FiAward,
        to: "/novedades/promociones"
    },
];

export const financialGuidanceItems: MainNavItem[] = [
    {
        text: "Educación Financiera",
        icon: FiBook,
        to: "/orientacion-financiera/consejos-ahorro"
    },
];

const userSupportItems: MainNavItem[] = [
    {
        text: "Protección al Usuario",
        icon: FiShield,
        to: "https://prousuario.gob.do/",
        isExternalLink: true
    },
    {
        text: "Deberes y derechos",
        icon: IoCardSharp,
        to: "/prousuario/derechos-deberes"
    },
    {
        text: "Buzón de sugerencias",
        icon: FiMessageSquare,
        to: "/prousuario/buzon-sugerencias"
    },
    {
        text: "Fraude",
        icon: FiAlertTriangle,
        to: "/prousuario/reporte-fraude"
    },
    {
        text: "Reclamación",
        icon: FiFileText,
        to: "/prousuario/solicitud-reclamacion"
    },
    // {
    //     text: "Tarifario",
    //     icon: FiDollarSign,
    //     to: "/prousuario/tarifario-productos-servicios"
    // },
    {
        text: "Cuentas abandonadas e Inactivas",
        icon: FiArchive,
        to: "/prousuario/cuentas-abandonadas"
    },
    {
        text: "Contratos de adhesión",
        icon: FiFile,
        to: "/prousuario/contratos-cuentas"
    },
    {
        text: "Canal de Denuncias",
        icon: FiBookOpen,
        to: "https://mocana.shogunmonitor.com",
        isExternalLink: true
    },
];

const buttonLink: IButtonLink = {
    appLink: 'https://www.ibanking.asomap.com.do/onlinebanking'
};

export const menuItems = {
    aboutItems,
    productItems,
    financialGuidanceItems
};

export { newsItems, userSupportItems, buttonLink };