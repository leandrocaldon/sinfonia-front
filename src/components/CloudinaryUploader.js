import React, { useEffect, useState } from 'react';

// Cloudinary Upload Widget Component
export default function CloudinaryUploader({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [widgetReady, setWidgetReady] = useState(false);
  
  // Verificar si el script de Cloudinary ya está cargado
  useEffect(() => {
    // Comprobar si cloudinary ya está disponible
    const checkCloudinary = () => {
      if (window.cloudinary) {
        setWidgetReady(true);
        return true;
      }
      return false;
    };
    
    // Si no está disponible inmediatamente, configurar un intervalo para verificar
    if (!checkCloudinary()) {
      const interval = setInterval(() => {
        if (checkCloudinary()) {
          clearInterval(interval);
        }
      }, 500);
      
      // Limpiar el intervalo cuando el componente se desmonte
      return () => clearInterval(interval);
    }
  }, []);
  
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
        disabled={!widgetReady || uploading}
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
