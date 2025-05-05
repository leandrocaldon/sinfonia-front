import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);
  const [animateMenu, setAnimateMenu] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 700);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Control de visibilidad del header al hacer scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) { // Ocultar al hacer scroll hacia abajo y después de 100px
        setVisible(false);
      } else { // Mostrar al hacer scroll hacia arriba
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

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
    <header className={`w-full bg-[#7b3f00] text-white shadow-md sticky top-0 z-50 flex items-center justify-between min-h-[100px] transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="flex items-center gap-4">
        <span 
          onClick={()=>navigate('/')} 
          className="cursor-pointer font-bold text-2xl tracking-wide ml-6 font-serif"
        >
          ☕ Sinfonia Coffee
        </span>
      </div>
      <nav className="mr-6 flex items-center gap-4">
        {/* Desktop menu */}
        <div className={`items-center gap-4 ${isMobile ? 'hidden' : 'flex'}`}>
          <button onClick={()=>navigate('/')} className="bg-transparent text-white border-none rounded-md py-2 px-4 font-semibold cursor-pointer text-base hover:bg-white/10">Inicio</button>
          <button onClick={()=>navigate('/')} className="bg-transparent text-white border-none rounded-md py-2 px-4 font-semibold cursor-pointer text-base hover:bg-white/10">Productos</button>
          <button onClick={()=>navigate('/contact')} className="bg-transparent text-white border-none rounded-md py-2 px-4 font-semibold cursor-pointer text-base hover:bg-white/10">Contacto</button>
          {user && user.isAdmin && (
            <button onClick={()=>navigate('/admin/contact-messages')} className="bg-transparent text-white border-none rounded-md py-2 px-4 font-semibold cursor-pointer text-base hover:bg-white/10">Mensajes</button>
          )}
          {!user && <button onClick={()=>navigate('/login')} className="bg-white text-[#7b3f00] border-none rounded-md py-2 px-5 font-semibold cursor-pointer hover:bg-gray-100">Login</button>}
          {!user && <button onClick={()=>navigate('/register')} className="bg-white text-[#7b3f00] border-none rounded-md py-2 px-5 font-semibold cursor-pointer hover:bg-gray-100">Registro</button>}
          {user && <span className="font-medium text-sm mr-2">Hola, {user.name}{user.isAdmin && ' (admin)'}</span>}
          {user && <button onClick={handleLogout} className="bg-white text-[#7b3f00] border-none rounded-md py-2 px-5 font-semibold cursor-pointer hover:bg-gray-100">Logout</button>}
        </div>
        {/* Menú hamburguesa para móviles */}
        <button 
          className={`bg-transparent border-none cursor-pointer ml-2 ${isMobile ? 'block' : 'hidden'}`}
          onClick={()=>setMenuOpen(!menuOpen)}
        >
          <span className="text-3xl text-white">&#9776;</span>
        </button>
        {/* Menú lateral móvil con animación y enlaces */}
        {(menuOpen || animateMenu) && isMobile && (
          <div className={`fixed top-0 right-0 w-60 h-screen bg-white shadow-lg z-50 flex flex-col items-start p-6 transition-transform duration-350 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <button 
              onClick={()=>setMenuOpen(false)} 
              className="self-end bg-transparent border-none text-3xl cursor-pointer text-[#7b3f00]"
            >
              ×
            </button>
            <button onClick={()=>handleNav('/')} className="bg-transparent text-[#7b3f00] border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-gray-100">Inicio</button>
            <button onClick={()=>handleNav('/')} className="bg-transparent text-[#7b3f00] border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-gray-100">Productos</button>
            <button onClick={()=>handleNav('/contact')} className="bg-transparent text-[#7b3f00] border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-gray-100">Contacto</button>
            {user && user.isAdmin && (
              <button onClick={()=>handleNav('/admin/contact-messages')} className="bg-transparent text-[#7b3f00] border-none rounded-md py-2 px-5 font-bold cursor-pointer my-1 w-full text-left text-lg hover:bg-gray-100">Mensajes</button>
            )}
            <div className="border-b border-gray-200 w-full my-2"></div>
            {!user && <button onClick={()=>handleNav('/login')} className="bg-[#7b3f00] text-white border-none rounded-md py-2 px-5 font-semibold cursor-pointer my-2 w-full text-left hover:bg-[#6a3500]">Login</button>}
            {!user && <button onClick={()=>handleNav('/register')} className="bg-[#7b3f00] text-white border-none rounded-md py-2 px-5 font-semibold cursor-pointer my-2 w-full text-left hover:bg-[#6a3500]">Registro</button>}
            {user && <span className="font-medium text-sm my-4">Hola, {user.name}{user.isAdmin && ' (admin)'}</span>}
            {user && <button onClick={()=>{handleLogout();setMenuOpen(false);}} className="bg-[#7b3f00] text-white border-none rounded-md py-2 px-5 font-semibold cursor-pointer my-2 w-full text-left hover:bg-[#6a3500]">Logout</button>}
          </div>
        )}
      </nav>
    </header>
  );
}
