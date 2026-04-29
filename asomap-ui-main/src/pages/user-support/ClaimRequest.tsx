import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { claimRequestData } from '@/mocks';
import { claimRequestService, claimRequestPageService } from '@/api';
import type { ISubmitClaimRequest, IClaimRequestPageData } from '@/interfaces';

interface FormData {
    fullName: string;
    document: string;
    phone: string;
    email: string;
    productType: string;
    claimType: string;
    distributionChannel: string;
    message: string;
}

const ClaimRequest: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        document: '',
        phone: '',
        email: '',
        productType: '',
        claimType: '',
        distributionChannel: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [pageData, setPageData] = useState<IClaimRequestPageData | null>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    // Cargar datos de la página al montar el componente
    useEffect(() => {
        const loadPageData = async () => {
            try {
                setIsLoadingPage(true);
                const data = await claimRequestPageService.getClaimRequestPage();
                setPageData(data);
            } catch (error) {
                // En caso de error, usar datos mock como fallback
                setPageData({
                    id: 0,
                    title: claimRequestData.title,
                    description: claimRequestData.description,
                    isActive: true,
                    createdAt: '',
                    updatedAt: ''
                });
            } finally {
                setIsLoadingPage(false);
            }
        };

        loadPageData();
    }, []);

    const validateDocument = (value: string) => {
        const valueWithoutHyphens = value.replace(/\D/g, '');
        return claimRequestData.validation.document.cedula.test(valueWithoutHyphens) ||
            claimRequestData.validation.document.pasaporte.test(value) ||
            claimRequestData.validation.document.rnc.test(valueWithoutHyphens);
    };

    const validatePhone = (value: string) => {
        const valueWithoutHyphens = value.replace(/\D/g, '');
        return claimRequestData.validation.phone.test(valueWithoutHyphens);
    };

    const formatDocument = (value: string) => {
        const numbers = value.replace(/\D/g, '').slice(0, 11);
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 10) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 10)}-${numbers.slice(10)}`;
    };

    const formatPhone = (value: string) => {
        const numbers = value.replace(/\D/g, '').slice(0, 10);
        if (numbers.length <= 3) return numbers;
        if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
        return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'document') {
            const formattedValue = formatDocument(value);
            setFormData(prev => ({
                ...prev,
                document: formattedValue
            }));
        } else if (name === 'phone') {
            const formattedValue = formatPhone(value);
            setFormData(prev => ({
                ...prev,
                phone: formattedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateDocument(formData.document)) {
            setError('Por favor, ingrese un número de documento válido');
            return;
        }

        if (!validatePhone(formData.phone)) {
            setError('Por favor, ingrese un número de teléfono válido (10 dígitos)');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Enviar datos al backend
            const backendMessage = await claimRequestService.submitClaimRequest(formData as ISubmitClaimRequest);
            
            // Mostrar mensaje de éxito del backend
            setSuccessMessage(backendMessage);
            setIsSubmitted(false);
            
            // Limpiar formulario
            setFormData({
                fullName: '',
                document: '',
                phone: '',
                email: '',
                productType: '',
                claimType: '',
                distributionChannel: '',
                message: ''
            });
        } catch (error) {
            setError('Error al enviar el formulario. Por favor, inténtelo nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col font-sans">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative -mt-[90px] bg-[#FBE3D2]"
            >
                <div className="container mx-auto px-4 py-2 pt-[40px] pb-[120px]">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* Columna izquierda - Texto */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="pr-4 md:pr-12"
                        >
                            {isLoadingPage ? (
                                <div className="animate-pulse">
                                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-[#2B4BA9] text-2xl font-bold mb-4">
                                        {pageData?.title || claimRequestData.title}
                                    </h1>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {pageData?.description || claimRequestData.description}
                                    </p>
                                </>
                            )}
                        </motion.div>

                        {/* Columna derecha - Formulario */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                {/* Mensaje de éxito */}
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-green-800">
                                                    {successMessage}
                                                </h3>
                                                <p className="mt-1 text-sm text-green-700">
                                                    Por favor, revise su correo electrónico para más información sobre su reclamación.
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Mensaje de error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    Error
                                                </h3>
                                                <p className="mt-1 text-sm text-red-700">
                                                    {error}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <h2 className="text-gray-700 text-lg font-medium mb-4">
                                        {claimRequestData.form.sections.personalInfo.title}
                                    </h2>

                                    {/* Campo de Nombres */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[0].label}
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder={claimRequestData.form.sections.personalInfo.fields[0].placeholder}
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Documento */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[1].label}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                Ce:
                                            </span>
                                            <input
                                                type="text"
                                                name="document"
                                                placeholder={claimRequestData.form.sections.personalInfo.fields[1].placeholder}
                                                value={formData.document}
                                                onChange={handleInputChange}
                                                maxLength={13}
                                                pattern="\d{3}-\d{7}-\d{1}"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400 pl-12"
                                            />
                                        </div>
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Teléfono */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[2].label}
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                                Tel:
                                            </span>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder={claimRequestData.form.sections.personalInfo.fields[2].placeholder}
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                maxLength={12}
                                                pattern="\d{3}-\d{3}-\d{4}"
                                                required
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400 pl-12"
                                            />
                                        </div>
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Email */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[3].label}
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder={claimRequestData.form.sections.personalInfo.fields[3].placeholder}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Tipo Producto Financiero */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[4].label}
                                        </label>
                                        <select
                                            name="productType"
                                            value={formData.productType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors appearance-none bg-white text-sm placeholder-gray-400"
                                        >
                                            <option value="">
                                                {claimRequestData.form.sections.personalInfo.fields[4].placeholder}
                                            </option>
                                            {claimRequestData.form.sections.personalInfo.fields[4].options?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Tipo de Reclamación */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[5].label}
                                        </label>
                                        <select
                                            name="claimType"
                                            value={formData.claimType}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors appearance-none bg-white text-sm placeholder-gray-400"
                                        >
                                            <option value="">
                                                {claimRequestData.form.sections.personalInfo.fields[5].placeholder}
                                            </option>
                                            {claimRequestData.form.sections.personalInfo.fields[5].options?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Canal de Distribución */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[6].label}
                                        </label>
                                        <select
                                            name="distributionChannel"
                                            value={formData.distributionChannel}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors appearance-none bg-white text-sm placeholder-gray-400"
                                        >
                                            <option value="">
                                                {claimRequestData.form.sections.personalInfo.fields[6].placeholder}
                                            </option>
                                            {claimRequestData.form.sections.personalInfo.fields[6].options?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Mensaje */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {claimRequestData.form.sections.personalInfo.fields[7].label}
                                        </label>
                                        <textarea
                                            name="message"
                                            placeholder={claimRequestData.form.sections.personalInfo.fields[7].placeholder}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors min-h-[120px] resize-none text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute top-0 -right-3 text-red-500 text-lg">*</span>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting || isSubmitted}
                                        className="w-full py-2 px-4 bg-[#F18221] text-white font-medium rounded-lg transition-all duration-300 hover:bg-[#F18221]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-6"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSubmitting ? 'Enviando...' : isSubmitted ? 'Enviado' : 'Enviar'}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ClaimRequest;

