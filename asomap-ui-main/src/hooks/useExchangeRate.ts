import { useState, useEffect } from 'react';
import { headerService } from '@/api';

interface ExchangeRate {
    currency: string;
    buyRate?: number;
    sellRate?: number;
    rate?: number;
}

interface ExchangeRateData {
    rates: ExchangeRate[];
}

export const useExchangeRate = () => {
    const [data, setData] = useState<ExchangeRateData>({ rates: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        headerService.getExchangeRate()
            .then((response) => {
                setData({ rates: response.rates ?? [] });
            })
            .catch((err) => {
                setError(err?.message ?? 'Error al cargar tasa de cambio');
            })
            .finally(() => setIsLoading(false));
    }, []);

    return { exchangeRateData: data, isLoading, error };
};
