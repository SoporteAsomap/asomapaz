import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fraudReportData } from '@/mocks';
import { fraudReportService, fraudReportPageService } from '@/api';
import type { ISubmitFraudReport, IFraudReportPageData } from '@/interfaces';

interface FormData {
    classification: string;
    fullName: string;
    document: string;
    phone: string;
    email: string;
    file: File | null;
    message: string;
}

const FraudReport: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        classification: '',
        fullName: '',
        document: '',
        phone: '',
        email: '',
        file: null,
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [pageData, setPageData] = useState<IFraudReportPageData | null>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    // Función para resetear el estado del formulario
    const resetFormState = () => {
        setIsSubmitted(false);
        setSuccessMessage('');
        setError(null);
        setFormData({
            classification: '',
            fullName: '',
            document: '',
            phone: '',
            email: '',
            file: null,
            message: ''
        });
    };

    // Cargar datos de la página al montar el componente
    useEffect(() => {
        const loadPageData = async () => {
            try {
                setIsLoadingPage(true);
                const data = await fraudReportPageService.getFraudReportPage();
                setPageData(data);
            } catch (error) {
                // En caso de error, usar datos mock como fallback
                setPageData({
                    id: 0,
                    title: fraudReportData.title,
                    description: fraudReportData.description,
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
        } else if (name === 'file') {
            const file = e.target.files?.[0] || null;
            setFormData(prev => ({
                ...prev,
                file
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

    const validateDocument = (value: string) => {
        const valueWithoutHyphens = value.replace(/\D/g, '');
        return fraudReportData.validation.document.cedula.test(valueWithoutHyphens) ||
            fraudReportData.validation.document.pasaporte.test(value) ||
            fraudReportData.validation.document.rnc.test(valueWithoutHyphens);
    };

    const validatePhone = (value: string) => {
        const valueWithoutHyphens = value.replace(/\D/g, '');
        return fraudReportData.validation.phone.test(valueWithoutHyphens);
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

        if (!formData.file) {
            setError('Por favor, adjunte un archivo');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Enviar datos al backend
            const backendMessage = await fraudReportService.submitFraudReport(formData as ISubmitFraudReport);
            
            // Mostrar mensaje de éxito del backend
            setSuccessMessage(backendMessage);
            setIsSubmitted(true);
            
            // Limpiar formulario pero mantener el estado de éxito
            setFormData({
                classification: '',
                fullName: '',
                document: '',
                phone: '',
                email: '',
                file: null,
                message: ''
            });

            // Auto-reset después de 5 segundos
            setTimeout(() => {
                setIsSubmitted(false);
                setSuccessMessage('');
            }, 3000);
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
                                        {pageData?.title || fraudReportData.title}
                                    </h1>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {pageData?.description || fraudReportData.description}
                                    </p>
                                </>
                            )}
                        </motion.div>

                        {/* Columna derecha - Formulario */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="bg-white rounded-2xl shadow-lg p-4">
                                {/* Mensaje de éxito */}
                                {isSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-4 w-4 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-2">
                                                    <h3 className="text-xs font-medium text-green-800">
                                                        {successMessage}
                                                    </h3>
                                                    <p className="text-xs text-green-700 mt-1">
                                                        Por favor, revise su correo electrónico para más información.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={resetFormState}
                                                className="ml-2 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                                            >
                                                Enviar otro
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Mensaje de error */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-2">
                                                <h3 className="text-xs font-medium text-red-800">
                                                    Error
                                                </h3>
                                                <p className="text-xs text-red-700 mt-1">
                                                    {error}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-2.5">
                                    <h2 className="text-gray-700 text-sm font-medium mb-3">
                                        {fraudReportData.form.sections.personalInfo.title}
                                    </h2>

                                    {/* Campo de Clasificación */}
                                    <div className="relative">
                                        <select
                                            name="classification"
                                            value={formData.classification}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors appearance-none bg-white text-sm placeholder-gray-400"
                                        >
                                            <option value="">{fraudReportData.form.sections.personalInfo.fields[0].placeholder}</option>
                                            {fraudReportData.form.sections.personalInfo.fields[0].options?.map((option) => (
                                                <option key={option} value={option.toLowerCase()}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Nombres */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="fullName"
                                            placeholder={fraudReportData.form.sections.personalInfo.fields[1].placeholder}
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Cédula */}
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            Ce:
                                        </span>
                                        <input
                                            type="text"
                                            name="document"
                                            placeholder={fraudReportData.form.sections.personalInfo.fields[2].placeholder}
                                            value={formData.document}
                                            onChange={handleInputChange}
                                            maxLength={13}
                                            pattern="\d{3}-\d{7}-\d{1}"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400 pl-12"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Teléfono */}
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                            Tel:
                                        </span>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder={fraudReportData.form.sections.personalInfo.fields[3].placeholder}
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            maxLength={12}
                                            pattern="\d{3}-\d{3}-\d{4}"
                                            required
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400 pl-12"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Email */}
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder={fraudReportData.form.sections.personalInfo.fields[4].placeholder}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Archivo */}
                                    <div className="relative">
                                        <input
                                            type="file"
                                            name="file"
                                            accept={fraudReportData.form.sections.personalInfo.fields[5].accept}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#2B4BA9] file:text-white hover:file:bg-[#2B4BA9]/90"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                        <span className="text-xs text-gray-400 mt-1 block">Formato jpg,png</span>
                                    </div>

                                    {/* Campo de Mensaje */}
                                    <div className="relative">
                                        <textarea
                                            name="message"
                                            placeholder={fraudReportData.form.sections.personalInfo.fields[6].placeholder}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors min-h-[60px] resize-none text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting || isSubmitted}
                                        className="w-full py-2 px-4 bg-[#F18221] text-white font-medium rounded-lg transition-all duration-300 hover:bg-[#F18221]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
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

export default FraudReport;

