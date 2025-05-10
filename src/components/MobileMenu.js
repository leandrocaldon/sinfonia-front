import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MobileMenu({ menuOpen, setMenuOpen, user, handleLogout }) {
  const navigate = useNavigate();
  const [animateMenu, setAnimateMenu] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 430);

  // Detectar pantalla pequeña
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 430);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animación para el menú lateral
  useEffect(() => {
    if (menuOpen) {
      setAnimateMenu(true);
      // Bloquear scroll cuando el menú está abierto
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => setAnimateMenu(false), 350);
      // Restaurar scroll cuando el menú se cierra
      document.body.style.overflow = 'auto';
    }

    // Limpiar el efecto al desmontar el componente
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  // Navegación y cierre de menú
  const handleNav = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  if (!(menuOpen || animateMenu)) {
    return null;
  }

  return (
    <div className={`fixed top-0 ${isSmallScreen ? 'left-0 w-full' : 'right-0 w-60'} h-screen bg-gradient-to-r from-purple-300 to-purple-400 shadow-lg z-50 flex flex-col items-start p-6 transition-transform duration-350 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button 
        onClick={() => setMenuOpen(false)} 
        className="self-end bg-transparent border-none text-3xl cursor-pointer text-white"
      >
        ×
      </button>
      {isSmallScreen && (
        <div className="w-full flex justify-center mb-6">
          <span className="font-bold text-2xl tracking-wide font-serif text-white">☕ Sinfonía Coffee</span>
        </div>
      )}
      <button onClick={() => handleNav('/')} className="bg-transparent text-white border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-white/20">Inicio</button>
      <button onClick={() => handleNav('/')} className="bg-transparent text-white border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-white/20">Productos</button>
      <button onClick={() => handleNav('/contact')} className="bg-transparent text-white border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-white/20">Contacto</button>
      {user && user.isAdmin && (
        <button onClick={() => handleNav('/admin/contact-messages')} className="bg-transparent text-white border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-white/20">Mensajes</button>
      )}
      <div className="border-b border-gray-200 w-full my-2"></div>
      {!user && <button onClick={() => handleNav('/login')} className="bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md py-2 px-5 font-semibold cursor-pointer my-2 w-full text-left hover:opacity-90">Login</button>}
      {!user && <button onClick={() => handleNav('/register')} className="bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md py-2 px-5 font-semibold cursor-pointer my-2 w-full text-left hover:opacity-90">Registro</button>}
      {user && <span className="font-medium text-sm my-4">Hola, {user.name}{user.isAdmin && ' (admin)'}</span>}
      {user && <button onClick={() => {handleLogout(); setMenuOpen(false);}} className="bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md py-2 px-5 font-semibold cursor-pointer my-2 w-full text-left hover:opacity-90">Logout</button>}
    </div>
  );
}
