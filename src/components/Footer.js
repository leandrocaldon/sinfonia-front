import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#7b3f00] text-white py-6 mt-12 shadow-inner">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <span className="font-serif text-xl font-semibold">☕ Sinfonia Coffee</span>
        </div>
        <div className="text-sm text-gray-200">
          © {new Date().getFullYear()} Sinfonia Coffee. Todos los derechos reservados.
        </div>
        <div className="flex gap-4 mt-2 md:mt-0">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">Instagram</a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-300 transition-colors">Facebook</a>
          <a href="mailto:info@sinfonia.coffee" className="hover:text-yellow-300 transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
