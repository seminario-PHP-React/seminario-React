// Configuración de la API
export const API_CONFIG = {
  // URL base del backend (usando proxy de Vite)
  BASE_URL: (import.meta as any).env?.VITE_API_BASE_URL || 'http://seminariophp.localhost',
  
  
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'x-api-key': 'abc123'
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función helper para obtener headers con autenticación
export const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}; 