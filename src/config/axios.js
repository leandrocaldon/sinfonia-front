import axios from 'axios';

// URL del servidor de producción (Vercel)
const API_URL = 'https://sinfonia-back.vercel.app/api/';

// Configuración base de axios optimizada para Netlify
const instance = axios.create({
  baseURL: API_URL,
  timeout: 20000, // Aumentamos el timeout a 20 segundos para conexiones más lentas
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  },
  // Deshabilitamos withCredentials ya que puede causar problemas en algunos navegadores
  withCredentials: false
});

// Interceptor para manejar errores
instance.interceptors.response.use(
  response => response,
  error => {
    // Manejar errores de red de forma más detallada
    if (error.message === 'Network Error') {
      console.error('Error de conexión con el servidor de Vercel:', error);
      
      // Mostrar mensaje informativo con más detalles
      console.info('Intentando conectar a: ' + API_URL);
      console.info('Comprueba que el backend esté activo en Vercel.');
    } else if (error.response) {
      // Error con respuesta del servidor
      console.error(`Error ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      // Error sin respuesta del servidor
      console.error('No se recibió respuesta del servidor');
    } else {
      // Otros errores
      console.error('Error en la solicitud:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
