import React, { useState } from 'react';
import axios from '../config/axios';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('/contact', form);
      setSent(true);
    } catch (err) {
      setError('Error al enviar el mensaje. Intenta de nuevo.');
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-100">
      <div className="bg-white p-9 rounded-xl shadow-md min-w-[340px] w-[380px]">
        <h2 className="text-center mb-6 text-xl font-bold">Contacto</h2>
        {sent ? (
          <div className="text-center text-green-700 font-semibold">
            ¡Gracias por contactarnos!<br />Te responderemos pronto.
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            placeholder="Tu nombre" 
            required 
            className="p-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
          />
          <input 
            type="email" 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            placeholder="Tu email" 
            required 
            className="p-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
          />
          <textarea 
            name="message" 
            value={form.message} 
            onChange={handleChange} 
            placeholder="Tu mensaje" 
            rows={4} 
            required 
            className="p-2.5 rounded-md border border-gray-300 resize-vertical focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
          />
          <button 
            type="submit" 
            className="py-3 bg-[#7b3f00] text-white border-none rounded-md font-bold text-base cursor-pointer hover:bg-[#6a3500] transition-colors"
          >
            Enviar
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
        )}
      </div>
    </div>
  );
}
