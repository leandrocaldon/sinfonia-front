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
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'80vh',background:'#f4f4f4'}}>
      <div style={{background:'#fff',padding:36,borderRadius:12,boxShadow:'0 2px 16px #ddd',minWidth:340}}>
        <h2 style={{textAlign:'center',marginBottom:24}}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{padding:10,borderRadius:6,border:'1px solid #ccc'}} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required style={{padding:10,borderRadius:6,border:'1px solid #ccc'}} />
          <button type="submit" style={{padding:12,background:'#7b3f00',color:'#fff',border:'none',borderRadius:6,fontWeight:'bold',fontSize:16,cursor:'pointer'}}>Entrar</button>
          {error && <p style={{color:'red',textAlign:'center'}}>{error}</p>}
        </form>
        <div style={{marginTop:18, fontSize:13, color:'#888',textAlign:'center'}}>
          Si eres administrador, inicia sesión con tu cuenta de administrador.<br />
          Si eres usuario normal, inicia sesión con tu cuenta de usuario.
        </div>
      </div>
    </div>
  );
}
