import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SideNav } from '@/components';
import { Footer, Header, Navbar } from '@/components/layout';
import { ScrollToTop } from '@/components/ui';
import { useMenuData } from '@/hooks/useMenuData';
import {
    aboutItems,
    financialGuidanceItems,
    newsItems,
    userSupportItems,
    buttonLink
} from '@/mocks';

// Lazy loading de las páginas
const Home = lazy(() => import('@/pages/home'));
// About
const AboutUs = lazy(() => import('@/pages/about').then(module => ({ default: module.AboutUs })));
const CommunitySupport = lazy(() => import('@/pages/about/CommunitySupport'));
const CommunityDetail = lazy(() => import('@/pages/about/CommunityDetail'));
const Memories = lazy(() => import('@/pages/about/Memories'));
const FinancialStatements = lazy(() => import('@/pages/about/FinancialStatements'));
const Policies = lazy(() => import('@/pages/about/Policies'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
// Services
const Services = lazy(() => import('@/pages/services'));

// Productos - Cuentas
const AccountDetail = lazy(() => import('@/pages/products/account/AccountDetail'));

// Tarjetas
const CardDetail = lazy(() => import('@/pages/products/cards/CardDetail'));

// Certificados
const CertificateDetail = lazy(() => import('@/pages/products/certificates/CertificateDetail'));

// Préstamos
const LoanDetail = lazy(() => import('@/pages/products/loans/LoanDetail'));

// Préstamos
const Loans = lazy(() => import('@/pages/products/loans/Loans'));
const ConsumerLoan = lazy(() => import('@/pages/products/loans/ConsumerLoan'));
const CommercialLoans = lazy(() => import('@/pages/products/loans/CommercialLoans'));
const MortgageLoans = lazy(() => import('@/pages/products/loans/MortgageLoans'));

// Certificados
const FinancialCertificate = lazy(() => import('@/pages/products/certificate/FinancialCertificate'));

// Noticias
const LatestNews = lazy(() => import('@/pages/news/LatestNews'));
const NewsDetail = lazy(() => import('@/pages/news/NewsDetail'));
// Promociones
const Promotions = lazy(() => import('@/pages/news/Promotions'));
const PromotionDetail = lazy(() => import('@/pages/news/PromotionDetail'));

// Orientación financiera
const SavingTips = lazy(() => import('@/pages/financial-guidance/SavingTips'));



// Soporte al usuario
const RightsAndDuties = lazy(() => import('@/pages/user-support/RightsAndDuties'));
const SuggestionBox = lazy(() => import('@/pages/user-support/SuggestionBox'));
const FraudReport = lazy(() => import('@/pages/user-support/FraudReport'));
const ClaimRequest = lazy(() => import('@/pages/user-support/ClaimRequest'));
const ServiceRates = lazy(() => import('@/pages/user-support/ServiceRates'));
const AbandonedAccounts = lazy(() => import('@/pages/user-support/AbandonedAccounts'));
const AccountContracts = lazy(() => import('@/pages/user-support/AccountContracts'));

// Ubicaciones
const MapLocations = lazy(() => import('@/components/MapLocations'));

export const AppRouter: React.FC = () => {
    const location = useLocation();
    const hideFooter = location.pathname === '/locations/map';
    const hideScrollToTop = location.pathname === '/locations/map';
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { menuData, loading: menuLoading } = useMenuData();

    // Obtener todas las secciones del menú de productos
    const productItems = menuLoading ? [] : menuData.map(section => ({
      text: section.text,
      icon: section.icon,
      subItems: section.subItems,
      image: section.image
    }));



    return (
        <>
            <Header isMobile={false} />
            <Navbar
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
                aboutItems={aboutItems}
                productItems={productItems}
                newsItems={newsItems}
                financialGuidanceItems={financialGuidanceItems}
                userSupportItems={userSupportItems}
                buttonLink={buttonLink}
            />
            <div className="min-h-screen pt-[calc(32px+56px)] lg:pt-[calc(32px+64px)]">
                <Suspense fallback={
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12"></div>
                    </div>
                }>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<Home />} />
                        <Route path="/servicios" element={<Services />} />

                        {/* About */}
                        <Route path="/nosotros/quienes-somos" element={<AboutUs />} />
                        <Route path="/nosotros/apoyo-comunitario" element={<CommunitySupport />} />
                        <Route path="/nosotros/iniciativa/:id" element={<CommunityDetail />} />
                        <Route path="/nosotros/recuerdos" element={<Memories />} />
                        <Route path="/nosotros/estados-financieros" element={<FinancialStatements />} />
                        <Route path="/nosotros/politicas" element={<Policies />} />
                        <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />

                        {/* Productos - Cuentas */}
                        <Route path="/productos/cuenta/:slug" element={<AccountDetail />} />

                        {/* Productos - Tarjetas */}
                        <Route path="/productos/tarjeta/:slug" element={<CardDetail />} />

                        {/* Productos - Certificados */}
                        <Route path="/productos/certificado/:slug" element={<CertificateDetail />} />

                        {/* Productos - Préstamos */}
                        <Route path="/productos/prestamo/:slug" element={<LoanDetail />} />

                        {/* Productos - Préstamos */}
                        <Route path="/productos/prestamos" element={<Loans />} />
                        <Route path="/productos/prestamos-consumo" element={<ConsumerLoan />} />
                        <Route path="/productos/prestamos-comerciales" element={<CommercialLoans />} />
                        <Route path="/productos/prestamos-hipotecarios" element={<MortgageLoans />} />

                        {/* Productos - Certificados */}
                        <Route path="/productos/certificado-financiero" element={<FinancialCertificate />} />

                        {/* Noticias */}
                        <Route path="/novedades/ultimas-noticias" element={<LatestNews />} />
                        <Route path="/novedades/ultimas-noticias/:id" element={<NewsDetail />} />
                        <Route path="/novedades/promociones" element={<Promotions />} />
                        <Route path="/novedades/promociones/:slug" element={<PromotionDetail />} />

                        {/* Orientación financiera */}
                        <Route path="/orientacion-financiera/consejos-ahorro" element={<SavingTips />} />
                        <Route path="/guia-financiera" element={<Navigate to="/orientacion-financiera/consejos-ahorro" replace />} />

                        {/* Soporte al usuario */}
                        <Route path="/prousuario/derechos-deberes" element={<RightsAndDuties />} />
                        <Route path="/prousuario/buzon-sugerencias" element={<SuggestionBox />} />
                        <Route path="/prousuario/reporte-fraude" element={<FraudReport />} />
                        <Route path="/prousuario/solicitud-reclamacion" element={<ClaimRequest />} />
                        <Route path="/prousuario/tarifario-productos-servicios" element={<ServiceRates />} />
                        <Route path="/prousuario/cuentas-abandonadas" element={<AbandonedAccounts />} />
                        <Route path="/prousuario/contratos-cuentas" element={<AccountContracts />} />

                        {/* Ubicaciones */}
                        <Route path="/locations/map" element={<MapLocations />} />

                        {/* Empresa - redirect a inicio hasta que tenga página propia */}
                        <Route path="/empresa" element={<Navigate to="/" replace />} />

                        {/* Redirección para rutas no encontradas */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </div>
            <SideNav />
            {!hideScrollToTop && <ScrollToTop />}
            {!hideFooter && <Footer />}
        </>
    );
};
