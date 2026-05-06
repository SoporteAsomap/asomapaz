import { API_CONFIG } from '@/api/config/config';

/**
 * Utility functions for environment management
 */

// Debug logging (only in development)
export const debugLog = (message: string, data?: any) => {
    void message;
    void data;
};

// Error logging with environment awareness
export const errorLog = (message: string, error?: any) => {
    void message;
    void error;
};

// Check if we should use mock data
export const shouldUseMockData = () => {
    return API_CONFIG.FEATURES.MOCK_DATA;
};

// Get appropriate API URL
export const getApiUrl = (endpoint: string) => {
    const baseUrl = API_CONFIG.BASE_URL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
};

// Convert relative image URLs to absolute backend URLs
export const getImageUrl = (relativePath: string) => {
    if (!relativePath) return '';
    
    // If it's already an absolute URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    
    // Use Vite environment variables for media URL
    const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || window.location.origin;
    
    // If the path already starts with /media, use it as is
    if (relativePath.startsWith('/media')) {
        const fullUrl = `${mediaBaseUrl}${relativePath}`;
        debugLog(`getImageUrl: ${relativePath} -> ${fullUrl}`);
        return fullUrl;
    }
    
    // If the path starts with /, remove it and add /media prefix
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const fullUrl = `${mediaBaseUrl}/media/${cleanPath}`;
    
    debugLog(`getImageUrl: ${relativePath} -> ${fullUrl}`);
    return fullUrl;
};

// Convert relative media URLs to absolute backend URLs (for videos and other media)
export const getMediaUrl = (relativePath: string) => {
    if (!relativePath) return '';
    
    // If it's already an absolute URL, return as is
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    
    // Use Vite environment variables for media URL
    const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || window.location.origin;
    
    // If the path already starts with /media, use it as is
    if (relativePath.startsWith('/media')) {
        const fullUrl = `${mediaBaseUrl}${relativePath}`;
        debugLog(`getMediaUrl: ${relativePath} -> ${fullUrl}`);
        return fullUrl;
    }
    
    // If the path starts with /, remove it and add /media prefix
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    const fullUrl = `${mediaBaseUrl}/media/${cleanPath}`;
    
    debugLog(`getMediaUrl: ${relativePath} -> ${fullUrl}`);
    return fullUrl;
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
    return {
        isDevelopment: API_CONFIG.IS_DEVELOPMENT,
        isProduction: API_CONFIG.IS_PRODUCTION,
        isStaging: API_CONFIG.IS_STAGING,
        baseUrl: API_CONFIG.BASE_URL,
        timeout: API_CONFIG.TIMEOUT,
        features: API_CONFIG.FEATURES,
        serverIP: import.meta.env.VITE_SERVER_IP,
        serverPort: import.meta.env.VITE_SERVER_PORT,
        nginxUrl: import.meta.env.VITE_NGINX_URL,
        backendUrl: import.meta.env.VITE_BACKEND_URL,
        mediaBaseUrl: import.meta.env.VITE_MEDIA_BASE_URL
    };
};

// Feature flag checker
export const isFeatureEnabled = (feature: keyof typeof API_CONFIG.FEATURES) => {
    return API_CONFIG.FEATURES[feature];
};

