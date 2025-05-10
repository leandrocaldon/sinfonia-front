import React, { useState } from 'react';
import axios from '../config/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Usar credenciales de prueba para desarrollo si estamos en localhost
      const loginData = { 
        email: email.trim(), 
        password: password 
      };
      
      console.log('Intentando iniciar sesión con:', { email: loginData.email });
      
      const res = await axios.post('/auth/login', loginData);
      console.log('Respuesta del servidor:', res.data);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location = '/';
    } catch (err) {
      console.error('Error completo:', err);
      
      if (err.response) {
        // El servidor respondió con un código de error
        if (err.response.status === 500) {
          setError('Error interno del servidor. Por favor intenta más tarde o contacta al administrador.');
          console.error('Error 500 del servidor:', err.response.data);
        } else {
          setError(err.response.data?.msg || `Error ${err.response.status}: ${err.response.statusText}`);
        }
      } else if (err.request) {
        // La solicitud se hizo pero no se recibió respuesta
        setError('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      } else {
        // Error al configurar la solicitud
        setError('Error al iniciar sesión: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
      <div className="bg-white p-9 rounded-xl shadow-md min-w-[340px]">
        <h2 className="text-center mb-6 text-xl font-bold">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className="p-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
          />
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Contraseña" 
            required 
            className="p-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
          />
          <button 
            type="submit" 
            disabled={loading}
            className="py-3 bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md font-bold text-base cursor-pointer hover:opacity-90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar'}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        <div className="mt-4.5 text-sm text-gray-500 text-center">
          Si eres administrador, inicia sesión con tu cuenta de administrador.<br />
          Si eres usuario normal, inicia sesión con tu cuenta de usuario.
        </div>
      </div>
    </div>
  );
}
