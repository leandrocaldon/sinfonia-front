import axios from 'axios';

// Configuración base de axios
const instance = axios.create({
  baseURL: 'https://sinfonia-back.vercel.app/'
});

export default instance;
