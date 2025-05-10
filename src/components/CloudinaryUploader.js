import React, { useEffect, useState } from 'react';

// Cloudinary Upload Widget Component
export default function CloudinaryUploader({ onImageUploaded }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  // Cargar el script de Cloudinary cuando el componente se monta
  useEffect(() => {
    if (!window.cloudinary && !scriptLoaded) {
      const script = document.createElement('script');
      script.src = 'https://upload-widget.cloudinary.com/global/all.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      setScriptLoaded(true);
    }
  }, [scriptLoaded]);
  
  const openWidget = () => {
    if (!window.cloudinary) {
      setError('El widget de Cloudinary no está disponible');
      return;
    }
    
    setUploading(true);
    setError('');
    
    // Configuración del widget
    const options = {
      cloudName: 'dfh2smmck', // Reemplaza con tu cloud_name de Cloudinary
      uploadPreset: 'sinfonia_uploads', // Reemplaza con tu upload_preset
      sources: ['local', 'url', 'camera'],
      multiple: false,
      maxFiles: 1,
      maxFileSize: 2000000, // 2MB
      styles: {
        palette: {
          window: "#FFFFFF",
          windowBorder: "#90A0B3",
          tabIcon: "#7731c6",
          menuIcons: "#5A616A",
          textDark: "#000000",
          textLight: "#FFFFFF",
          link: "#7731c6",
          action: "#7731c6",
          inactiveTabIcon: "#0E2F5A",
          error: "#F44235",
          inProgress: "#7731c6",
          complete: "#20B832",
          sourceBg: "#E4EBF1"
        },
        fonts: {
          default: null,
          "'Poppins', sans-serif": {
            url: "https://fonts.googleapis.com/css?family=Poppins",
            active: true
          }
        }
      }
    };
    
    // Crear e iniciar el widget
    const widget = window.cloudinary.createUploadWidget(
      options,
      (error, result) => {
        if (!error && result && result.event === "success") {
          // Obtener la URL de la imagen subida
          const imageUrl = result.info.secure_url;
          onImageUploaded(imageUrl);
          setUploading(false);
        }
        
        if (error) {
          setError('Error al subir la imagen');
          console.error('Error de Cloudinary:', error);
          setUploading(false);
        }
        
        if (result && result.event === "close") {
          setUploading(false);
        }
      }
    );
    
    widget.open();
  };
  
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={openWidget}
        disabled={!scriptLoaded || uploading}
        className="flex items-center justify-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-base font-medium text-gray-700">
          {uploading ? 'Subiendo...' : 'Seleccionar imagen'}
        </span>
      </button>
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
