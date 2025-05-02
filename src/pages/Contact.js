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
      await axios.post('/api/contact', form);
      setSent(true);
    } catch (err) {
      setError('Error al enviar el mensaje. Intenta de nuevo.');
    }
  };

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'80vh',background:'#f4f4f4'}}>
      <div style={{background:'#fff',padding:36,borderRadius:12,boxShadow:'0 2px 16px #ddd',minWidth:340, width:380}}>
        <h2 style={{textAlign:'center',marginBottom:24}}>Contacto</h2>
        {sent ? (
          <div style={{textAlign:'center',color:'#228B22',fontWeight:600}}>
            ¡Gracias por contactarnos!<br />Te responderemos pronto.
          </div>
        ) : (
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required style={{padding:10,borderRadius:6,border:'1px solid #ccc'}} />
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Tu email" required style={{padding:10,borderRadius:6,border:'1px solid #ccc'}} />
          <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tu mensaje" rows={4} required style={{padding:10,borderRadius:6,border:'1px solid #ccc',resize:'vertical'}} />
          <button type="submit" style={{padding:12,background:'#7b3f00',color:'#fff',border:'none',borderRadius:6,fontWeight:'bold',fontSize:16,cursor:'pointer'}}>Enviar</button>
          {error && <p style={{color:'red',textAlign:'center'}}>{error}</p>}
        </form>
        )}
      </div>
    </div>
  );
}
