import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { suggestionBoxData } from '@/mocks';
import { suggestionBoxService, suggestionBoxPageService } from '@/api';
import type { IProvinceData, ISuggestionBoxPageData } from '@/interfaces';

interface SuggestionFormData {
    classification: string;
    fullName: string;
    document: string;
    phone: string;
    email: string;
    province: string | number;
    message: string;
    [key: string]: unknown;
}

const SuggestionBox: React.FC = () => {
    const [formData, setFormData] = useState<SuggestionFormData>({
        classification: '',
        fullName: '',
        document: '',
        phone: '',
        email: '',
        province: '',
        message: ''
    });
    const [provinces, setProvinces] = useState<IProvinceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [pageData, setPageData] = useState<ISuggestionBoxPageData | null>(null);
    const [isLoadingPage, setIsLoadingPage] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setIsLoadingPage(true);
                
                // Cargar provincias y datos de la página en paralelo
                const [provincesData, pageDataResult] = await Promise.all([
                    suggestionBoxService.getProvinces(),
                    suggestionBoxPageService.getSuggestionBoxPage()
                ]);
                
                setProvinces(provincesData);
                setPageData(pageDataResult);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar los datos');
                
                // En caso de error, usar datos mock como fallback para la página
                setPageData({
                    id: 0,
                    title: suggestionBoxData.title,
                    description: suggestionBoxData.description,
                    isActive: true,
                    createdAt: '',
                    updatedAt: ''
                });
            } finally {
                setLoading(false);
                setIsLoadingPage(false);
            }
        };

        fetchData();
    }, []);

    const validateDocument = (value: string) => {
        const valueWithoutHyphens = value.replace(/\D/g, '');
        return suggestionBoxData.validation.document.cedula.test(valueWithoutHyphens) ||
            suggestionBoxData.validation.document.pasaporte.test(value) ||
            suggestionBoxData.validation.document.rnc.test(valueWithoutHyphens);
    };

    const validatePhone = (value: string) => {
        const valueWithoutHyphens = value.replace(/\D/g, '');
        return suggestionBoxData.validation.phone.test(valueWithoutHyphens);
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
            alert('Por favor, ingrese un número de documento válido');
            return;
        }

        if (!validatePhone(formData.phone)) {
            alert('Por favor, ingrese un número de teléfono válido (10 dígitos)');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await suggestionBoxService.submitSuggestionBox(formData);
            setSuccessMessage(response);
            setFormData({
                classification: '',
                fullName: '',
                document: '',
                phone: '',
                email: '',
                province: '',
                message: ''
            });
        } catch (error) {
            alert('Error al enviar el formulario. Por favor, intente nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col font-sans">
                <div className="relative -mt-[90px] bg-[#FBE3D2] min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4BA9] mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando provincias...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col font-sans">
                <div className="relative -mt-[90px] bg-[#FBE3D2] min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Error al cargar los datos
                        </h2>
                        <p className="text-gray-600">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

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
                                        {pageData?.title || suggestionBoxData.title}
                                    </h1>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {pageData?.description || suggestionBoxData.description}
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
                                {successMessage && (
                                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-800 text-sm">{successMessage}</p>
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} className="space-y-2.5">
                                    <h2 className="text-gray-700 text-sm font-medium mb-3">
                                        {suggestionBoxData.form.sections.personalInfo.title}
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
                                            <option value="">{suggestionBoxData.form.sections.personalInfo.fields[0].placeholder}</option>
                                            {suggestionBoxData.form.sections.personalInfo.fields[0].options?.map((option) => (
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
                                            placeholder={suggestionBoxData.form.sections.personalInfo.fields[1].placeholder}
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
                                            placeholder={suggestionBoxData.form.sections.personalInfo.fields[2].placeholder}
                                            value={formData.document}
                                            onChange={handleInputChange}
                                            maxLength={13}
                                            pattern="\d{3}-\d{7}-\d{1}"
                                            required
                                            className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400"
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
                                            placeholder={suggestionBoxData.form.sections.personalInfo.fields[3].placeholder}
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
                                            placeholder={suggestionBoxData.form.sections.personalInfo.fields[4].placeholder}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    {/* Campo de Provincia */}
                                    <div className="relative">
                                        <select
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors appearance-none bg-white text-sm placeholder-gray-400"
                                        >
                                            <option value="">Seleccione una provincia</option>
                                            {provinces.map((province) => (
                                                <option key={province.id} value={province.id}>
                                                    {province.name}
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

                                    {/* Campo de Mensaje */}
                                    <div className="relative">
                                        <textarea
                                            name="message"
                                            placeholder={suggestionBoxData.form.sections.personalInfo.fields[5].placeholder}
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:border-[#2B4BA9] focus:ring-1 focus:ring-[#2B4BA9]/20 transition-colors min-h-[60px] resize-none text-sm placeholder-gray-400"
                                        />
                                        <span className="absolute -right-3 top-1/2 -translate-y-1/2 text-red-500 text-lg">*</span>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-2 px-4 bg-[#F18221] text-white font-medium rounded-lg transition-all duration-300 hover:bg-[#F18221]/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-1"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {isSubmitting ? 'Enviando...' : 'Enviar'}
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

export default SuggestionBox;

