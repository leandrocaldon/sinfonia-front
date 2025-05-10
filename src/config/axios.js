import axios from 'axios';

// Determinar si estamos en desarrollo local o producción
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// URL del servidor de producción
const PRODUCTION_API_URL = 'https://sinfonia-back.vercel.app/api/';

// Configuración base de axios
const instance = axios.create({
  baseURL: PRODUCTION_API_URL, // Por defecto, usar la URL de producción
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para manejar errores
instance.interceptors.response.use(
  response => response,
  error => {
    // Manejar errores de red
    if (error.message === 'Network Error') {
      console.error('Error de conexión con el servidor.');
      
      // Mostrar mensaje informativo
      console.info('Usando el servidor de producción para las solicitudes.');
    }
    
    return Promise.reject(error);
  }
);

export default instance;
