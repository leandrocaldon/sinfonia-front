import React, { useState } from 'react';
import axios from '../config/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location = '/';
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al iniciar sesión');
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
            className="py-3 bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md font-bold text-base cursor-pointer hover:bg-[#6a3500] transition-colors"
          >
            Entrar
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
