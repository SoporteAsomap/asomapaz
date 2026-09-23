import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

type CalculatorType = 'mortgage' | 'commercial' | 'consumer' | 'deposit' | 'vehicle';

interface CalculatorModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

interface MortgageFormState {
    destination: string;
    homePrice: number;
    amount: number;
    rate: number;
    termMonths: string;
    age: string;
    sex: string;
    propertyType: string;
    borrowerCount: string;
}

interface CommercialFormState {
    amount: number;
    rate: number;
    termMonths: string;
}

interface ConsumerFormState {
    amount: number;
    rate: number;
    termMonths: string;
}

interface DepositFormState {
    amount: number;
    rate: number;
    termMonths: string;
}

interface VehicleFormState {
    type: string;
    year: string;
    amount: number;
    rate: number;
    termMonths: string;
}

interface AmortizationRow {
    installment: number;
    date: string;
    capital: number;
    interest: number;
    insurance: number;
    payment: number;
    balance: number;
}

interface MortgageResult {
    capitalInterest: number;
    totalInterest: number;
    lifeInsurance: number;
    fireInsurance: number;
    totalInstallment: number;
    rows: AmortizationRow[];
}

interface CommercialResult {
    capitalInterest: number;
    totalInterest: number;
    lifeInsurance: number;
    totalInstallment: number;
    rows: AmortizationRow[];
}

interface ConsumerResult {
    totalToPay: number;
    totalInterest: number;
    lifeInsurance: number;
    totalInstallment: number;
}

interface DepositResult {
    initialCapital: number;
    generatedInterest: number;
    finalAmount: number;
}

interface VehicleResult {
    totalInstallment: number;
    totalInterest: number;
    totalToPay: number;
}

const INITIAL_MORTGAGE_FORM: MortgageFormState = {
    destination: '',
    homePrice: 0,
    amount: 0,
    rate: 0,
    termMonths: '',
    age: '',
    sex: '',
    propertyType: '',
    borrowerCount: '',
};

const INITIAL_COMMERCIAL_FORM: CommercialFormState = {
    amount: 0,
    rate: 0,
    termMonths: '',
};

const INITIAL_CONSUMER_FORM: ConsumerFormState = {
    amount: 0,
    rate: 0,
    termMonths: '',
};

const INITIAL_DEPOSIT_FORM: DepositFormState = {
    amount: 0,
    rate: 0,
    termMonths: '',
};

const INITIAL_VEHICLE_FORM: VehicleFormState = {
    type: '',
    year: '',
    amount: 0,
    rate: 0,
    termMonths: '',
};

const calculatorTabs: Array<{ id: CalculatorType; label: string }> = [
    { id: 'mortgage', label: 'Préstamos Hipotecario' },
    { id: 'commercial', label: 'Préstamos Comerciales' },
    { id: 'consumer', label: 'Préstamos Consumo' },
    { id: 'vehicle', label: 'Préstamo Vehículo' },
    { id: 'deposit', label: 'Depósito a Plazo' },
];

// Plazos de 6 en 6 meses
const mortgageTermsMonths = Array.from({ length: 40 }, (_, index) => (index + 1) * 6); // Hasta 240 meses
const otherLoansTermsMonths = Array.from({ length: 10 }, (_, index) => (index + 1) * 6); // Hasta 60 meses
const depositTerms = [
    ...Array.from({ length: 11 }, (_, index) => index + 1),
    ...Array.from({ length: 5 }, (_, index) => (index + 1) * 12),
];

const formatCurrency = (value: number) =>
    value.toLocaleString('es-DO', {
        style: 'currency',
        currency: 'DOP',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const parseMoneyInput = (value: string) => {
    const normalized = value.replace(/[^0-9.]/g, '');
    return normalized ? parseFloat(normalized) : 0;
};

const formatPaymentDate = (date: Date) =>
    date.toLocaleDateString('es-DO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

const calculateAmortizedPayment = (amount: number, annualRatePercent: number, months: number) => {
    const monthlyRate = annualRatePercent / 100 / 12;
    return amount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
};

const buildAmortizationRows = (amount: number, annualRatePercent: number, months: number, insuranceAmount: number) => {
    const monthlyRate = annualRatePercent / 100 / 12;
    const basePayment = calculateAmortizedPayment(amount, annualRatePercent, months);
    const rows: AmortizationRow[] = [];
    let balance = amount;
    let totalInterest = 0;
    const paymentDate = new Date();

    for (let index = 1; index <= months; index += 1) {
        const interest = balance * monthlyRate;
        const capital = basePayment - interest;
        balance -= capital;
        totalInterest += interest;

        rows.push({
            installment: index,
            date: formatPaymentDate(paymentDate),
            capital,
            interest,
            insurance: insuranceAmount,
            payment: basePayment + insuranceAmount,
            balance: Math.max(balance, 0),
        });

        paymentDate.setMonth(paymentDate.getMonth() + 1);
    }

    return {
        rows,
        totalInterest,
        basePayment,
    };
};

const CurrencyField: React.FC<{
    id: string;
    label: string;
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
}> = ({ id, label, value, onChange, placeholder = 'RD$ 0.00' }) => {
    const [displayValue, setDisplayValue] = useState(value ? formatCurrency(value) : '');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            setDisplayValue(value ? formatCurrency(value) : '');
        }
    }, [value, isEditing]);

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </label>
            <input
                id={id}
                type="text"
                inputMode="decimal"
                value={displayValue}
                placeholder={placeholder}
                onChange={(event) => {
                    const rawValue = event.target.value;
                    setDisplayValue(rawValue);
                    onChange(parseMoneyInput(rawValue));
                }}
                onFocus={() => {
                    setIsEditing(true);
                    setDisplayValue(value ? String(value) : '');
                }}
                onBlur={() => {
                    setIsEditing(false);
                    setDisplayValue(value ? formatCurrency(value) : '');
                }}
                className="w-full border-b border-secondary-light bg-transparent px-0 py-2 text-base text-neutral-100 outline-none transition-colors focus:border-primary-accent"
            />
        </div>
    );
};

const NumberField: React.FC<{
    id: string;
    label: string;
    value: number | string;
    onChange: (value: string) => void;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
}> = ({ id, label, value, onChange, min, max, step = 1, placeholder }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
        </label>
        <input
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className="w-full border-b border-secondary-light bg-transparent px-0 py-2 text-base text-neutral-100 outline-none transition-colors focus:border-primary-accent"
        />
    </div>
);

const SelectField: React.FC<{
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder?: string;
}> = ({ id, label, value, onChange, options, placeholder = 'Seleccione...' }) => (
    <div className="space-y-2">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
        </label>
        <select
            id={id}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="w-full border-b border-secondary-light bg-transparent px-0 py-2 text-base text-neutral-100 outline-none transition-colors focus:border-primary-accent"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

// Actualizado para manejar el tamaño de texto de forma más inteligente y permitir un estilo destacado (hero)
const ResultCard: React.FC<{
    label: string;
    value: string;
    emphasized?: boolean;
    hero?: boolean; // Nueva prop para destacar el valor principal
}> = ({ label, value, emphasized = false, hero = false }) => {
    // Si el valor es muy largo, reducimos un poco el tamaño de fuente, pero permitimos salto de línea
    const isLongValue = value.length > 18;
    
    if (hero) {
        return (
            <div className="col-span-full rounded-3xl border-2 border-primary bg-gradient-to-br from-primary to-primary-dark p-8 shadow-xl text-center">
                <p className="text-white/80 font-medium tracking-wide uppercase text-sm mb-2">{label}</p>
                <p className={`font-extrabold text-white break-words leading-tight ${isLongValue ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'}`}>
                    {value}
                </p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl border px-5 py-4 shadow-sm flex flex-col justify-center min-w-0 ${emphasized ? 'border-primary bg-gradient-to-br from-primary to-primary-dark text-white' : 'border-secondary-light bg-slate-50 text-neutral-100'}`}>
            <p className={`text-sm mb-1 font-medium ${emphasized ? 'text-white/80' : 'text-slate-500'}`}>{label}</p>
            <p className={`font-bold leading-tight break-words ${isLongValue ? 'text-lg' : 'text-xl'}`}>
                {value}
            </p>
        </div>
    );
};

const ProductNotice: React.FC<{ text: string }> = ({ text }) => (
    <div className="mt-6 rounded-3xl border border-primary/10 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm leading-6 text-neutral-300">{text}</p>
        <Link
            to="/prousuario/tarifario-productos-servicios"
            className="mt-3 inline-flex text-sm font-semibold text-primary transition-colors hover:text-primary-accent"
        >
            Conoce nuestro tarifario de productos y servicios
        </Link>
    </div>
);

const AmortizationTable: React.FC<{ rows: AmortizationRow[] }> = ({ rows }) => (
    <div className="mt-6 overflow-hidden rounded-3xl border border-secondary-light bg-white shadow-sm">
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-gradient-to-r from-primary/10 to-secondary/20 text-left text-primary">
                    <tr>
                        <th className="px-4 py-3 font-semibold">#</th>
                        <th className="px-4 py-3 font-semibold">Fecha</th>
                        <th className="px-4 py-3 font-semibold">Capital</th>
                        <th className="px-4 py-3 font-semibold">Interés</th>
                        <th className="px-4 py-3 font-semibold">Seguros</th>
                        <th className="px-4 py-3 font-semibold">Cuota</th>
                        <th className="px-4 py-3 font-semibold">Saldo</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={`${row.installment}-${row.date}`} className="border-t border-secondary-light/70">
                            <td className="px-4 py-3">{row.installment}</td>
                            <td className="px-4 py-3">{row.date}</td>
                            <td className="px-4 py-3">{formatCurrency(row.capital)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.insurance)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.payment)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.balance)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, closeModal }) => {
    const [calculatorType, setCalculatorType] = useState<CalculatorType>('mortgage');
    const [errorMessage, setErrorMessage] = useState('');

    const [mortgageForm, setMortgageForm] = useState(INITIAL_MORTGAGE_FORM);
    const [commercialForm, setCommercialForm] = useState(INITIAL_COMMERCIAL_FORM);
    const [consumerForm, setConsumerForm] = useState(INITIAL_CONSUMER_FORM);
    const [depositForm, setDepositForm] = useState(INITIAL_DEPOSIT_FORM);
    const [vehicleForm, setVehicleForm] = useState(INITIAL_VEHICLE_FORM);

    const [mortgageResult, setMortgageResult] = useState<MortgageResult | null>(null);
    const [commercialResult, setCommercialResult] = useState<CommercialResult | null>(null);
    const [consumerResult, setConsumerResult] = useState<ConsumerResult | null>(null);
    const [depositResult, setDepositResult] = useState<DepositResult | null>(null);
    const [vehicleResult, setVehicleResult] = useState<VehicleResult | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setCalculatorType('mortgage');
            setErrorMessage('');
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => document.removeEventListener('keydown', handleEscape);
    }, [closeModal, isOpen]);

    const vehicleTermOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const year = parseInt(vehicleForm.year, 10);
        
        let maxMonths = 60; // Max default is 5 years (60 months)

        if (year) {
            const age = currentYear - year;
            let maxYears = 12 - age;
            if (maxYears > 5) {
                maxYears = 5;
            }
            if (maxYears < 1) {
                maxYears = 1;
            }
            maxMonths = maxYears * 12;
        }

        const options = [];
        for (let i = 6; i <= maxMonths; i += 6) {
            options.push(i);
        }

        return options;
    }, [vehicleForm.year]);

    const resetError = () => setErrorMessage('');

    const calculateMortgage = () => {
        resetError();

        const destination = mortgageForm.destination;
        const homePrice = mortgageForm.homePrice;
        const amount = mortgageForm.amount;
        const rate = mortgageForm.rate;
        const termMonths = parseInt(mortgageForm.termMonths, 10);
        const age = parseInt(mortgageForm.age, 10);
        const sex = mortgageForm.sex;
        const propertyType = mortgageForm.propertyType;
        const borrowerCount = parseInt(mortgageForm.borrowerCount, 10);

        if (!destination) {
            setErrorMessage('Seleccione un destino de préstamo');
            return;
        }

        if (destination === 'compra' && (Number.isNaN(homePrice) || homePrice <= 0)) {
            setErrorMessage('Ingrese un precio de vivienda válido');
            return;
        }

        if (Number.isNaN(amount) || amount <= 0) {
            setErrorMessage('Ingrese un monto válido');
            return;
        }

        if (Number.isNaN(rate) || rate <= 0) {
            setErrorMessage('Ingrese una tasa válida');
            return;
        }

        if (Number.isNaN(termMonths) || termMonths < 6 || termMonths > 240) {
            setErrorMessage('Seleccione un plazo válido (hasta 240 meses)');
            return;
        }

        if (!sex) {
            setErrorMessage('Seleccione el sexo del deudor');
            return;
        }

        if (Number.isNaN(age)) {
            setErrorMessage('Ingrese una edad válida.');
            return;
        }

        if (age < 18) {
            setErrorMessage(`El cliente tiene ${age} años. No cumple con la edad mínima requerida de 18 años para solicitar el préstamo.`);
            return;
        }

        if (age > 69) {
            setErrorMessage(`El cliente tiene ${age} años. La edad máxima permitida para solicitar el préstamo es 69 años.`);
            return;
        }

        if (age + (termMonths / 12) > 75) {
            setErrorMessage(`El cliente tiene ${age} años y con un plazo de ${termMonths} meses alcanzaría ${Math.floor(age + termMonths / 12)} años. La edad máxima permitida al finalizar el préstamo es 75 años.`);
            return;
        }

        if (!propertyType) {
            setErrorMessage('Seleccione tipo de inmueble');
            return;
        }

        if (Number.isNaN(borrowerCount) || borrowerCount < 1 || borrowerCount > 2) {
            setErrorMessage('Seleccione 1 o 2 deudores');
            return;
        }

        const months = termMonths;
        const insuranceRate = borrowerCount === 2 ? 0.8 : 0.5;
        let lifeInsurance = 0;
        let fireInsurance = 0;

        if (propertyType === 'vivienda' || propertyType === 'solar') {
            lifeInsurance = (amount * insuranceRate / 1000) * 1.16;
        }

        if (propertyType === 'vivienda') {
            fireInsurance = (amount * 0.67 / 1000) * 1.16;
        }

        const insuranceTotal = lifeInsurance + fireInsurance;
        const amortization = buildAmortizationRows(amount, rate, months, insuranceTotal);

        setMortgageResult({
            capitalInterest: amount + amortization.totalInterest,
            totalInterest: amortization.totalInterest,
            lifeInsurance,
            fireInsurance,
            totalInstallment: amortization.basePayment + lifeInsurance + fireInsurance,
            rows: amortization.rows,
        });
    };

    const calculateCommercial = () => {
        resetError();

        const amount = commercialForm.amount;
        const rate = commercialForm.rate;
        const termMonths = parseInt(commercialForm.termMonths, 10);

        if (Number.isNaN(amount) || amount <= 0) {
            setErrorMessage('Ingrese un monto válido');
            return;
        }

        if (Number.isNaN(rate) || rate <= 0) {
            setErrorMessage('Ingrese una tasa válida');
            return;
        }

        if (Number.isNaN(termMonths) || termMonths < 6 || termMonths > 60) {
            setErrorMessage('Ingrese un plazo válido (hasta 60 meses)');
            return;
        }

        const months = termMonths;
        const lifeInsurance = (amount * 0.6 / 1000) * 1.16;
        const amortization = buildAmortizationRows(amount, rate, months, lifeInsurance);

        setCommercialResult({
            capitalInterest: amount + amortization.totalInterest,
            totalInterest: amortization.totalInterest,
            lifeInsurance,
            totalInstallment: amortization.basePayment + lifeInsurance,
            rows: amortization.rows,
        });
    };

    const calculateConsumer = () => {
        resetError();

        const amount = consumerForm.amount;
        const rate = consumerForm.rate;
        const termMonths = parseInt(consumerForm.termMonths, 10);

        if (Number.isNaN(amount) || amount <= 0) {
            setErrorMessage('Ingrese un monto válido');
            return;
        }

        if (Number.isNaN(rate) || rate <= 0) {
            setErrorMessage('Ingrese una tasa válida');
            return;
        }

        if (Number.isNaN(termMonths) || termMonths < 6 || termMonths > 60) {
            setErrorMessage('Seleccione un plazo válido (hasta 60 meses)');
            return;
        }

        const months = termMonths;
        const basePayment = calculateAmortizedPayment(amount, rate, months);
        const lifeInsurance = (amount * 0.5 / 1000) * 1.16;
        const totalInstallment = basePayment + lifeInsurance;
        const totalToPay = totalInstallment * months;
        const totalInterest = (basePayment * months) - amount;

        setConsumerResult({
            totalToPay,
            totalInterest,
            lifeInsurance,
            totalInstallment,
        });
    };

    const calculateDeposit = () => {
        resetError();

        const capital = depositForm.amount;
        const rate = depositForm.rate / 100;
        const months = parseInt(depositForm.termMonths, 10);

        if (Number.isNaN(capital) || capital <= 0) {
            setErrorMessage('Ingrese un monto válido');
            return;
        }

        if (capital < 10000) {
            setErrorMessage('El monto mínimo de apertura es RD$10,000.00');
            return;
        }

        if (Number.isNaN(rate) || rate <= 0) {
            setErrorMessage('Ingrese una tasa válida.');
            return;
        }

        if (Number.isNaN(months) || months < 1 || months > 120) {
            setErrorMessage('El plazo permitido es 1 a 120 meses.');
            return;
        }

        const compoundsPerYear = 12;
        const totalYears = months / 12;
        const finalAmount = capital * Math.pow(1 + rate / compoundsPerYear, compoundsPerYear * totalYears);
        const generatedInterest = finalAmount - capital;

        setDepositResult({
            initialCapital: capital,
            generatedInterest,
            finalAmount,
        });
    };

    const calculateVehicle = () => {
        resetError();

        const type = vehicleForm.type;
        const year = parseInt(vehicleForm.year, 10);
        const amount = vehicleForm.amount;
        const rate = vehicleForm.rate;
        const termMonths = parseInt(vehicleForm.termMonths, 10);

        if (!type) {
            setErrorMessage('Seleccione la condición del vehículo');
            return;
        }

        if (Number.isNaN(year)) {
            setErrorMessage('Ingrese el año del vehículo');
            return;
        }

        if (Number.isNaN(termMonths)) {
            setErrorMessage('Seleccione el plazo del préstamo');
            return;
        }

        const currentYear = new Date().getFullYear();
        const difference = currentYear - year;

        if (type === 'usado' && difference > 8) {
            setErrorMessage('Vehículo usado no puede tener más de 8 años');
            return;
        }

        if (type === 'nuevo' && difference > 5) {
            setErrorMessage('Vehículo nuevo debe estar dentro de los últimos 5 años');
            return;
        }

        if (Number.isNaN(amount) || amount <= 0) {
            setErrorMessage('Ingrese un monto válido');
            return;
        }

        if (Number.isNaN(rate) || rate <= 0) {
            setErrorMessage('Ingrese una tasa válida');
            return;
        }

        const months = termMonths;
        const payment = calculateAmortizedPayment(amount, rate, months);
        const totalToPay = payment * months;
        const totalInterest = totalToPay - amount;

        setVehicleResult({
            totalInstallment: payment,
            totalInterest,
            totalToPay,
        });
    };

    const renderMortgage = () => (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                <SelectField
                    id="destination"
                    label="Destino del préstamo"
                    value={mortgageForm.destination}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, destination: value }))}
                    options={[
                        { value: 'compra', label: 'Compra' },
                        { value: 'construccion', label: 'Construcción' },
                        { value: 'apliacion', label: 'Ampliación, remodelación, terminación' },
                    ]}
                    placeholder="Selecciona..."
                />

                {mortgageForm.destination === 'compra' && (
                    <CurrencyField
                        id="homePrice"
                        label="Precio de vivienda"
                        value={mortgageForm.homePrice}
                        onChange={(value) => setMortgageForm((current) => ({ ...current, homePrice: value }))}
                    />
                )}

                <CurrencyField
                    id="amount"
                    label="Monto del préstamo"
                    value={mortgageForm.amount}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, amount: value }))}
                />

                <NumberField
                    id="rate"
                    label="Tasa de interés (%)"
                    value={mortgageForm.rate || ''}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, rate: value === '' ? 0 : parseFloat(value) }))}
                    step={0.01}
                    min={0}
                />

                <SelectField
                    id="termMonths"
                    label="Plazo (meses)"
                    value={mortgageForm.termMonths}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, termMonths: value }))}
                    options={mortgageTermsMonths.map((term) => ({ value: String(term), label: String(term) }))}
                    placeholder="Seleccione plazo"
                />

                <SelectField
                    id="borrowerCount"
                    label="Cantidad de deudores"
                    value={mortgageForm.borrowerCount}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, borrowerCount: value }))}
                    options={[
                        { value: '1', label: '1 deudor' },
                        { value: '2', label: '2 deudores' },
                    ]}
                    placeholder="Seleccione cantidad"
                />

                <SelectField
                    id="sex"
                    label="Sexo del deudor"
                    value={mortgageForm.sex}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, sex: value }))}
                    options={[
                        { value: 'M', label: 'M' },
                        { value: 'F', label: 'F' },
                    ]}
                />

                <NumberField
                    id="age"
                    label="Edad del deudor"
                    value={mortgageForm.age}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, age: value }))}
                    min={18}
                />

                <SelectField
                    id="propertyType"
                    label="Tipo de inmueble"
                    value={mortgageForm.propertyType}
                    onChange={(value) => setMortgageForm((current) => ({ ...current, propertyType: value }))}
                    options={[
                        { value: 'vivienda', label: 'Vivienda' },
                        { value: 'solar', label: 'Solar' },
                    ]}
                />
            </div>

            <button
                type="button"
                onClick={calculateMortgage}
                className="mt-8 w-full rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-primary-dark"
            >
                Calcular
            </button>

            {mortgageResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-secondary-light">
                        <h4 className="text-2xl font-bold text-slate-900 mb-6">Resumen del Préstamo</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Tarjeta Hero para la Cuota */}
                            <ResultCard 
                                label="Cuota Mensual Estimada" 
                                value={formatCurrency(mortgageResult.totalInstallment)} 
                                hero 
                            />
                            
                            {/* Tarjetas de Desglose */}
                            <ResultCard label="Capital + Interés" value={formatCurrency(mortgageResult.capitalInterest)} />
                            <ResultCard label="Interés Total" value={formatCurrency(mortgageResult.totalInterest)} />
                            <ResultCard label="Seguro de Vida" value={formatCurrency(mortgageResult.lifeInsurance)} />
                            <ResultCard label="Seguro de Incendio" value={formatCurrency(mortgageResult.fireInsurance)} />
                        </div>
                    </div>

                    <div className="mt-6 rounded-3xl border-l-4 border-primary bg-slate-50 px-5 py-4 text-sm text-slate-600">
                        Estos cálculos son aproximados. Para obtener el monto exacto de la cuota del préstamo, por favor visita la sucursal de tu preferencia.
                    </div>

                    <AmortizationTable rows={mortgageResult.rows} />
                </motion.div>
            )}

            {!mortgageResult && <ProductNotice text="Estos cálculos son aproximados. Para obtener el monto exacto de la cuota del préstamo, por favor visita la sucursal de tu preferencia." />}
        </>
    );

    const renderCommercial = () => (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                <CurrencyField
                    id="commercialAmount"
                    label="Monto del préstamo"
                    value={commercialForm.amount}
                    onChange={(value) => setCommercialForm((current) => ({ ...current, amount: value }))}
                />

                <NumberField
                    id="commercialRate"
                    label="Tasa de interés (%)"
                    value={commercialForm.rate || ''}
                    onChange={(value) => setCommercialForm((current) => ({ ...current, rate: value === '' ? 0 : parseFloat(value) }))}
                    step={0.01}
                    min={0}
                />

                <SelectField
                    id="commercialTerm"
                    label="Plazo (meses)"
                    value={commercialForm.termMonths}
                    onChange={(value) => setCommercialForm((current) => ({ ...current, termMonths: value }))}
                    options={otherLoansTermsMonths.map((term) => ({ value: String(term), label: String(term) }))}
                    placeholder="Seleccione plazo"
                />
            </div>

            <button
                type="button"
                onClick={calculateCommercial}
                className="mt-8 w-full rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-primary-dark"
            >
                Calcular
            </button>

            {commercialResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-secondary-light">
                        <h4 className="text-2xl font-bold text-slate-900 mb-6">Resumen del Préstamo</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Tarjeta Hero para la Cuota */}
                            <ResultCard 
                                label="Cuota Mensual Estimada" 
                                value={formatCurrency(commercialResult.totalInstallment)} 
                                hero 
                            />
                            
                            {/* Tarjetas de Desglose */}
                            <ResultCard label="Capital + Interés" value={formatCurrency(commercialResult.capitalInterest)} />
                            <ResultCard label="Interés Total" value={formatCurrency(commercialResult.totalInterest)} />
                            <ResultCard label="Seguro" value={formatCurrency(commercialResult.lifeInsurance)} />
                        </div>
                    </div>

                    <AmortizationTable rows={commercialResult.rows} />
                </motion.div>
            )}

            {!commercialResult && <ProductNotice text="Estos cálculos son aproximados. Para obtener el monto exacto de la cuota del préstamo, por favor visita la sucursal de tu preferencia." />}
        </>
    );

    const renderConsumer = () => (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                <CurrencyField
                    id="consumerAmount"
                    label="Monto del préstamo"
                    value={consumerForm.amount}
                    onChange={(value) => setConsumerForm((current) => ({ ...current, amount: value }))}
                />

                <NumberField
                    id="consumerRate"
                    label="Tasa de interés (%)"
                    value={consumerForm.rate || ''}
                    onChange={(value) => setConsumerForm((current) => ({ ...current, rate: value === '' ? 0 : parseFloat(value) }))}
                    step={0.01}
                    min={0}
                />

                <SelectField
                    id="consumerTerm"
                    label="Plazo (meses)"
                    value={consumerForm.termMonths}
                    onChange={(value) => setConsumerForm((current) => ({ ...current, termMonths: value }))}
                    options={otherLoansTermsMonths.map((term) => ({ value: String(term), label: String(term) }))}
                    placeholder="Seleccione plazo"
                />
            </div>

            <button
                type="button"
                onClick={calculateConsumer}
                className="mt-8 w-full rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-primary-dark"
            >
                Calcular
            </button>

            {consumerResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-secondary-light">
                        <h4 className="text-2xl font-bold text-slate-900 mb-6">Resumen del Préstamo</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Tarjeta Hero para la Cuota */}
                            <ResultCard 
                                label="Cuota Mensual Estimada" 
                                value={formatCurrency(consumerResult.totalInstallment)} 
                                hero 
                            />
                            
                            {/* Tarjetas de Desglose */}
                            <ResultCard label="Total a Pagar" value={formatCurrency(consumerResult.totalToPay)} />
                            <ResultCard label="Interés Total" value={formatCurrency(consumerResult.totalInterest)} />
                            <ResultCard label="Seguro" value={formatCurrency(consumerResult.lifeInsurance)} />
                        </div>
                    </div>
                </motion.div>
            )}

            {!consumerResult && <ProductNotice text="Estos cálculos son aproximados. Para obtener el monto exacto de la cuota del préstamo, por favor visita la sucursal de tu preferencia." />}
        </>
    );

    const renderDeposit = () => (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                <CurrencyField
                    id="depositAmount"
                    label="Monto a invertir"
                    value={depositForm.amount}
                    onChange={(value) => setDepositForm((current) => ({ ...current, amount: value }))}
                />

                <NumberField
                    id="depositRate"
                    label="Tasa de interés anual (%)"
                    value={depositForm.rate || ''}
                    onChange={(value) => setDepositForm((current) => ({ ...current, rate: value === '' ? 0 : parseFloat(value) }))}
                    step={0.01}
                    min={0}
                />

                <SelectField
                    id="depositTerm"
                    label="Plazo (meses)"
                    value={depositForm.termMonths}
                    onChange={(value) => setDepositForm((current) => ({ ...current, termMonths: value }))}
                    options={depositTerms.map((term) => ({
                        value: String(term),
                        label: String(term),
                    }))}
                    placeholder="Seleccione plazo"
                />
            </div>

            <button
                type="button"
                onClick={calculateDeposit}
                className="mt-8 w-full rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-primary-dark"
            >
                Calcular Depósito
            </button>

            <div className="mt-6 rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
                <h4 className="text-xl font-bold text-primary">Importante:</h4>
                <ul className="mt-4 space-y-2 text-sm text-neutral-300">
                    <li><strong className="text-neutral-100">Monto mínimo de apertura:</strong> RD$10,000.00</li>
                    <li><strong className="text-neutral-100">Retención de Impuestos sobre intereses pagados:</strong></li>
                    <li>Personas físicas: 10%</li>
                    <li>Empresas: 1%</li>
                </ul>
            </div>

            {depositResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-secondary-light">
                        <h4 className="text-2xl font-bold text-slate-900 mb-6">Resultado de Inversión</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tarjeta Hero para el Total */}
                            <ResultCard 
                                label="Total Acumulado" 
                                value={formatCurrency(depositResult.finalAmount)} 
                                hero 
                            />
                            
                            {/* Tarjetas de Desglose */}
                            <ResultCard label="Capital Inicial" value={formatCurrency(depositResult.initialCapital)} />
                            <ResultCard label="Interés Generado" value={formatCurrency(depositResult.generatedInterest)} />
                        </div>
                    </div>
                </motion.div>
            )}

            {!depositResult && <ProductNotice text="Estos cálculos son aproximados. Para obtener el monto exacto por favor visita la sucursal de tu preferencia." />}
        </>
    );

    const renderVehicle = () => (
        <>
            <div className="grid gap-6 md:grid-cols-2">
                <SelectField
                    id="vehicleType"
                    label="Condición del vehículo"
                    value={vehicleForm.type}
                    onChange={(value) => setVehicleForm((current) => ({ ...current, type: value, year: '', termMonths: '' }))}
                    options={[
                        { value: 'nuevo', label: 'Nuevo' },
                        { value: 'usado', label: 'Usado' },
                    ]}
                />

                <NumberField
                    id="vehicleYear"
                    label="Año del Vehículo"
                    value={vehicleForm.year}
                    onChange={(value) => setVehicleForm((current) => ({ ...current, year: value, termMonths: '' }))}
                    min={1990}
                    max={new Date().getFullYear() + 1}
                />

                <CurrencyField
                    id="vehicleAmount"
                    label="Monto del préstamo"
                    value={vehicleForm.amount}
                    onChange={(value) => setVehicleForm((current) => ({ ...current, amount: value }))}
                />

                <NumberField
                    id="vehicleRate"
                    label="Tasa de interés (%)"
                    value={vehicleForm.rate || ''}
                    onChange={(value) => setVehicleForm((current) => ({ ...current, rate: value === '' ? 0 : parseFloat(value) }))}
                    step={0.01}
                    min={0}
                />

                <SelectField
                    id="vehicleTerm"
                    label="Plazo (meses)"
                    value={vehicleForm.termMonths}
                    onChange={(value) => setVehicleForm((current) => ({ ...current, termMonths: value }))}
                    options={vehicleTermOptions.map((term) => ({ value: String(term), label: String(term) }))}
                    placeholder="Seleccione plazo"
                />
            </div>

            <button
                type="button"
                onClick={calculateVehicle}
                className="mt-8 w-full rounded-2xl bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-primary-dark"
            >
                Calcular Préstamo
            </button>

            {vehicleResult && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
                    <div className="rounded-3xl bg-white p-6 shadow-sm border border-secondary-light">
                        <h4 className="text-2xl font-bold text-slate-900 mb-6">Resumen del Préstamo</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Tarjeta Hero para la Cuota */}
                            <ResultCard 
                                label="Cuota Mensual Estimada" 
                                value={formatCurrency(vehicleResult.totalInstallment)} 
                                hero 
                            />
                            
                            {/* Tarjetas de Desglose */}
                            <ResultCard label="Interés Total" value={formatCurrency(vehicleResult.totalInterest)} />
                            <ResultCard label="Total a Pagar" value={formatCurrency(vehicleResult.totalToPay)} />
                        </div>
                    </div>
                </motion.div>
            )}

            {!vehicleResult && <ProductNotice text="Estos cálculos son aproximados. Para obtener el monto exacto de la cuota del préstamo por favor visita la sucursal de tu preferencia." />}
        </>
    );

    const renderContent = () => {
        switch (calculatorType) {
            case 'mortgage':
                return renderMortgage();
            case 'commercial':
                return renderCommercial();
            case 'consumer':
                return renderConsumer();
            case 'deposit':
                return renderDeposit();
            case 'vehicle':
                return renderVehicle();
            default:
                return null;
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className="w-full max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 16, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-primary/10 bg-gradient-to-r from-primary to-primary-dark px-6 py-4 text-white">
                            <div>
                                <h2 className="text-xl font-bold text-white">Calculadora Financiera</h2>
                                <p className="text-sm text-white/80">Cálculo estimado con la lógica solicitada para préstamos y depósitos.</p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Cerrar calculadora"
                                className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="max-h-[85vh] overflow-y-auto bg-gradient-to-br from-background-dark via-white to-primary/5 p-6">
                            <div className="grid gap-3 md:grid-cols-5">
                                {calculatorTabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => {
                                            setCalculatorType(tab.id);
                                            setErrorMessage('');
                                        }}
                                        className={`rounded-2xl border px-4 py-4 text-sm font-semibold transition-all ${calculatorType === tab.id ? 'border-primary bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg' : 'border-secondary-light bg-white text-primary hover:border-primary-accent hover:text-primary-dark'}`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-6 rounded-3xl border border-white/70 bg-white p-6 shadow-sm">
                                <h3 className="text-2xl font-bold text-primary">
                                    {calculatorTabs.find((tab) => tab.id === calculatorType)?.label} - Información General
                                </h3>

                                {errorMessage && (
                                    <div className="mt-6 rounded-2xl border border-primary-accent/30 bg-primary-accent/10 px-4 py-3 text-sm text-primary-dark">
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="mt-8">
                                    {renderContent()}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CalculatorModal;