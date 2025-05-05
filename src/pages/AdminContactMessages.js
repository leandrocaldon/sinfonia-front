import React, { useEffect, useState } from 'react';
import axios from '../config/axios';

export default function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        const token = localStorage.getItem('token');
        if (!user || !user.isAdmin) {
          setError('Acceso solo para administradores.');
          return;
        }
        const res = await axios.get('/contact', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        setError('No se pudieron obtener los mensajes.');
      }
    };
    fetchMessages();
  }, []);

  return (
    <div className="max-w-[700px] mx-auto my-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-center mb-6 text-xl font-bold">Mensajes de Contacto</h2>
      
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      
      {messages.length === 0 && !error && (
        <div className="text-center text-gray-500">No hay mensajes de contacto aún.</div>
      )}
      
      {messages.map(msg => (
        <div key={msg._id} className="border border-gray-200 rounded-lg p-4 mb-4.5 hover:shadow-sm transition-shadow">
          <div className="font-bold text-lg mb-1">{msg.name} &lt;{msg.email}&gt;</div>
          <div className="text-[#7b3f00] mb-2">{new Date(msg.createdAt).toLocaleString()}</div>
          <div className="text-base">{msg.message}</div>
        </div>
      ))}
    </div>
  );
}
