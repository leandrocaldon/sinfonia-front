import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="w-full bg-[#7b3f00] text-white py-6 mt-12">
      {/* Versión móvil y tablet pequeña - Apilada verticalmente */}
      <div className="lg:hidden container mx-auto px-4 flex flex-col items-center gap-4 py-2">
        <div>
          <span className="cursor-pointer font-bold text-xl tracking-wide font-serif">☕ Sinfonia Coffee</span>
        </div>
        <div className="text-center">
          <span className="text-sm text-gray-200">
            {new Date().getFullYear()} Sinfonia Coffee. Todos los derechos reservados.
          </span>
        </div>
        <div className="flex gap-6">
          <a 
            href="https://www.instagram.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-yellow-300 transition-colors transform hover:scale-110 duration-200"
          >
            <FontAwesomeIcon icon={faInstagram} style={{color: "#cd35d0"}} className="text-xl" />
          </a>
          <a 
            href="https://www.facebook.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-yellow-300 transition-colors transform hover:scale-110 duration-200"
          >
            <FontAwesomeIcon icon={faFacebook} style={{color: "#74C0FC"}} className="text-xl" />
          </a>
          <a 
            href="mailto:info@sinfonia.coffee" 
            className="hover:text-yellow-300 transition-colors transform hover:scale-110 duration-200"
          >
            <FontAwesomeIcon icon={faEnvelope} style={{color: "#e24822"}} className="text-xl" />
          </a>
        </div>
      </div>
      
      {/* Versión escritorio - Con posicionamiento relativo/absoluto */}
      <div className="hidden lg:block relative container mx-auto px-4 py-4">
        {/* Texto central */}
        <div className="text-center">
          <span className="text-base text-gray-200">
            {new Date().getFullYear()} Sinfonia Coffee. Todos los derechos reservados.
          </span>
        </div>
        
        {/* Logo - Posición absoluta a la izquierda */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
          <span className="cursor-pointer font-bold text-2xl tracking-wide font-serif">☕ Sinfonia Coffee</span>
        </div>
        
        {/* Redes sociales - Posición absoluta a la derecha */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <div className="flex gap-6">
            <a 
              href="https://www.instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-300 transition-colors transform hover:scale-110 duration-200"
            >
              <FontAwesomeIcon icon={faInstagram} style={{color: "#cd35d0"}} className="text-2xl" />
            </a>
            <a 
              href="https://www.facebook.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-yellow-300 transition-colors transform hover:scale-110 duration-200"
            >
              <FontAwesomeIcon icon={faFacebook} style={{color: "#74C0FC"}} className="text-2xl" />
            </a>
            <a 
              href="mailto:info@sinfonia.coffee" 
              className="hover:text-yellow-300 transition-colors transform hover:scale-110 duration-200"
            >
              <FontAwesomeIcon icon={faEnvelope} style={{color: "#e24822"}} className="text-2xl" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
