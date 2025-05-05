import React, { useState } from 'react';
import axios from '../config/axios';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', { name, email, password, isAdmin });
      setSuccess('Registro exitoso, ahora puedes iniciar sesión');
      setError('');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error en el registro');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
      <div className="bg-white p-9 rounded-xl shadow-md min-w-[340px]">
        <h2 className="text-center mb-6 text-xl font-bold">Registro</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Nombre" 
            required 
            className="p-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
          />
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
          <label className="block my-2 text-sm">
            <input 
              type="checkbox" 
              checked={isAdmin} 
              onChange={e => setIsAdmin(e.target.checked)} 
              className="mr-2"
            /> 
            Registrar como administrador
          </label>
          <button 
            type="submit" 
            className="py-3 bg-[#7b3f00] text-white border-none rounded-md font-bold text-base cursor-pointer hover:bg-[#6a3500] transition-colors"
          >
            Registrar
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-600 text-center">{success}</p>}
        </form>
      </div>
    </div>
  );
}
