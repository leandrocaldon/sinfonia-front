import React from 'react';

export default function ProductCard({ product, onEdit, onDelete, isAdmin }) {
  return (
    <div style={{
      border:'none',
      borderRadius:16,
      padding:20,
      margin:16,
      width:300,
      background:'#fff',
      boxShadow:'0 4px 24px 0 #e2c9a0',
      transition:'transform 0.2s, box-shadow 0.2s',
      display:'flex',
      flexDirection:'column',
      alignItems:'center',
      position:'relative',
      minHeight:370
    }}
    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)'}
    onMouseOut={e => e.currentTarget.style.transform = 'none'}
    >
      {product.image && <img src={product.image} alt={product.name} style={{width:'100%', height:160, objectFit:'cover', borderRadius:12, marginBottom:12, background:'#f8f8f8'}} />}
      <h3 style={{margin:'0 0 8px 0', fontWeight:700, fontSize:22, color:'#7b3f00', fontFamily:'serif'}}>{product.name}</h3>
      <p style={{minHeight:50, color:'#444', fontSize:15, marginBottom:16, textAlign:'center'}}>{product.description}</p>
      <span style={{fontWeight:600, color:'#3d2200', fontSize:18, marginBottom:8}}>${product.price}</span>
      {isAdmin && (
        <div style={{marginTop:14, display:'flex', gap:8}}>
          <button onClick={() => onEdit(product)} style={{background:'#ffe2b3', color:'#7b3f00', border:'none', borderRadius:6, padding:'7px 14px', cursor:'pointer', fontWeight:600}}>Editar</button>
          <button onClick={() => onDelete(product._id)} style={{background:'#ffbdbd', color:'#a10000', border:'none', borderRadius:6, padding:'7px 14px', cursor:'pointer', fontWeight:600}}>Eliminar</button>
        </div>
      )}
    </div>
  );
}
