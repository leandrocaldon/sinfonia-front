import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [animateMenu, setAnimateMenu] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animación para el menú lateral
  useEffect(() => {
    if (menuOpen) {
      setAnimateMenu(true);
    } else {
      setTimeout(() => setAnimateMenu(false), 350);
    }
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/login';
  };

  // Navegación y cierre de menú
  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header style={{
      width: '100%',
      background: '#7b3f00',
      color: '#fff',
      boxShadow: '0 2px 12px #e2c9a0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 64,
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <span onClick={()=>navigate('/')} style={{cursor:'pointer',fontWeight:700,fontSize:24,letterSpacing:1,marginLeft:24,fontFamily:'serif'}}>☕ Sinfonia Coffee</span>
      </div>
      <nav className="header-nav" style={{marginRight:24,display:'flex',alignItems:'center',gap:18}}>
        {/* Desktop menu */}
        <div className="header-desktop-menu" style={{display: isMobile ? 'none' : 'flex', alignItems:'center', gap:18}}>
          <button onClick={()=>navigate('/')} style={navBtnStyle}>Inicio</button>
          <button onClick={()=>navigate('/')} style={navBtnStyle}>Productos</button>
          <button onClick={()=>navigate('/contact')} style={navBtnStyle}>Contacto</button>
          {user && user.isAdmin && (
            <button onClick={()=>navigate('/admin/contact-messages')} style={navBtnStyle}>Mensajes</button>
          )}
          {!user && <button onClick={()=>navigate('/login')} style={btnStyle}>Login</button>}
          {!user && <button onClick={()=>navigate('/register')} style={btnStyle}>Registro</button>}
          {user && <span style={{fontWeight:500,fontSize:15,marginRight:10}}>Hola, {user.name}{user.isAdmin && ' (admin)'}</span>}
          {user && <button onClick={handleLogout} style={btnStyle}>Logout</button>}
        </div>
        {/* Menú hamburguesa para móviles */}
        <button className="burger" onClick={()=>setMenuOpen(!menuOpen)} style={{background:'none',border:'none',display: isMobile ? 'block' : 'none',cursor:'pointer',marginLeft:10}}>
          <span style={{fontSize:32, color:'#fff'}}>&#9776;</span>
        </button>
        {/* Menú lateral móvil con animación y enlaces */}
        {(menuOpen || animateMenu) && isMobile && (
          <div style={{
            position:'fixed',
            top:0,
            right:0,
            width:240,
            height:'100vh',
            background:'#fff',
            boxShadow:'-2px 0 12px #e2c9a0',
            zIndex:999,
            display:'flex',
            flexDirection:'column',
            alignItems:'flex-start',
            padding:24,
            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            transition:'transform 0.35s cubic-bezier(.68,-0.55,.27,1.55)',
          }}>
            <button onClick={()=>setMenuOpen(false)} style={{alignSelf:'flex-end',background:'none',border:'none',fontSize:28,cursor:'pointer',color:'#7b3f00'}}>×</button>
            <button onClick={()=>handleNav('/')} style={sideNavBtnStyle}>Inicio</button>
            <button onClick={()=>handleNav('/')} style={sideNavBtnStyle}>Productos</button>
            <button onClick={()=>handleNav('/contact')} style={sideNavBtnStyle}>Contacto</button>
            {user && user.isAdmin && (
              <button onClick={()=>handleNav('/admin/contact-messages')} style={sideNavBtnStyle}>Mensajes</button>
            )}
            <div style={{borderBottom:'1px solid #eee',width:'100%',margin:'10px 0'}}></div>
            {!user && <button onClick={()=>handleNav('/login')} style={sideBtnStyle}>Login</button>}
            {!user && <button onClick={()=>handleNav('/register')} style={sideBtnStyle}>Registro</button>}
            {user && <span style={{fontWeight:500,fontSize:15,margin:'16px 0'}}>Hola, {user.name}{user.isAdmin && ' (admin)'}</span>}
            {user && <button onClick={()=>{handleLogout();setMenuOpen(false);}} style={sideBtnStyle}>Logout</button>}
          </div>
        )}
      </nav>
    </header>
  );
}

const btnStyle = {
  background:'#fff',color:'#7b3f00',border:'none',borderRadius:6,padding:'8px 20px',fontWeight:600,cursor:'pointer'
};
const navBtnStyle = {
  background:'none',color:'#fff',border:'none',borderRadius:6,padding:'8px 16px',fontWeight:600,cursor:'pointer',fontSize:16
};
const sideBtnStyle = {
  background:'#7b3f00',color:'#fff',border:'none',borderRadius:6,padding:'10px 20px',fontWeight:600,cursor:'pointer',margin:'8px 0',width:'100%',textAlign:'left'
};
const sideNavBtnStyle = {
  background:'none',color:'#7b3f00',border:'none',borderRadius:6,padding:'10px 20px',fontWeight:700,cursor:'pointer',margin:'4px 0',width:'100%',textAlign:'left',fontSize:17
};
