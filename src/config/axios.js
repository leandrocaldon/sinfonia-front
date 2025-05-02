import axios from 'axios';

// Configuración base de axios
const instance = axios.create({
  baseURL: 'https://back-sinfonia.vercel.app'
});

export default instance;
