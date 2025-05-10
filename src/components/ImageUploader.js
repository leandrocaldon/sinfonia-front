import React, { useState } from 'react';
import axios from '../config/axios';

export default function ImageUploader({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.includes('image/')) {
      setError('El archivo debe ser una imagen');
      return;
    }

    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('La imagen no debe superar 2MB');
      return;
    }

    setUploading(true);
    setError('');
    
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('image', file);

    try {
      // Simular progreso (en un entorno real, esto vendría del evento de progreso de axios)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Enviar archivo al servidor
      const token = localStorage.getItem('token');
      const response = await axios.post('upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setProgress(100);
      
      // Notificar al componente padre con la URL de la imagen subida
      if (response.data && response.data.imageUrl) {
        onImageUploaded(response.data.imageUrl);
      }
    } catch (err) {
      setError('Error al subir la imagen');
      console.error(err);
    } finally {
      setUploading(false);
      // Resetear progreso después de un momento
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center px-4 py-2 bg-white rounded-md border border-gray-300 cursor-pointer hover:bg-gray-50">
        <span className="text-base font-medium text-gray-700">
          {uploading ? `Subiendo... ${progress}%` : 'Seleccionar imagen'}
        </span>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
      
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-purple-900 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
