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
    <div style={{maxWidth:700,margin:'40px auto',padding:24,background:'#fff',borderRadius:12,boxShadow:'0 2px 16px #eee'}}>
      <h2 style={{textAlign:'center',marginBottom:24}}>Mensajes de Contacto</h2>
      {error && <div style={{color:'red',textAlign:'center',marginBottom:16}}>{error}</div>}
      {messages.length === 0 && !error && (
        <div style={{textAlign:'center',color:'#888'}}>No hay mensajes de contacto aún.</div>
      )}
      {messages.map(msg => (
        <div key={msg._id} style={{border:'1px solid #eee',borderRadius:8,padding:16,marginBottom:18}}>
          <div style={{fontWeight:700,fontSize:17,marginBottom:4}}>{msg.name} &lt;{msg.email}&gt;</div>
          <div style={{color:'#7b3f00',marginBottom:8}}>{new Date(msg.createdAt).toLocaleString()}</div>
          <div style={{fontSize:16}}>{msg.message}</div>
        </div>
      ))}
    </div>
  );
}
