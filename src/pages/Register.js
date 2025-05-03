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
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'80vh',background:'#f4f4f4'}}>
      <div style={{background:'#fff',padding:36,borderRadius:12,boxShadow:'0 2px 16px #ddd',minWidth:340}}>
        <h2 style={{textAlign:'center',marginBottom:24}}>Registro</h2>
        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:16}}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required style={{padding:10,borderRadius:6,border:'1px solid #ccc'}} />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required style={{padding:10,borderRadius:6,border:'1px solid #ccc'}} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required style={{padding:10,borderRadius:6,border:'1px solid #ccc'}} />
          <label style={{display:'block',margin:'8px 0',fontSize:14}}>
            <input type="checkbox" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} style={{marginRight:8}}/> Registrar como administrador
          </label>
          <button type="submit" style={{padding:12,background:'#7b3f00',color:'#fff',border:'none',borderRadius:6,fontWeight:'bold',fontSize:16,cursor:'pointer'}}>Registrar</button>
          {error && <p style={{color:'red',textAlign:'center'}}>{error}</p>}
          {success && <p style={{color:'green',textAlign:'center'}}>{success}</p>}
        </form>
      </div>
    </div>
  );
}
