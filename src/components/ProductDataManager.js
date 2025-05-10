import React, { useState } from 'react';
import axios from '../config/axios';

export default function ProductDataManager({ products, setProducts, token }) {
  const [importing, setImporting] = useState(false);
  const [exportUrl, setExportUrl] = useState('');

  // Exportar productos a un archivo JSON
  const handleExport = () => {
    // Crear un objeto Blob con los datos de los productos
    const data = JSON.stringify(products, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    
    // Crear URL para descargar el archivo
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
    
    // Crear un enlace y hacer clic en él para descargar
    const a = document.createElement('a');
    a.href = url;
    a.download = `sinfonia-products-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Limpiar
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportUrl('');
    }, 100);
  };

  // Importar productos desde un archivo JSON
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImporting(true);
      
      // Leer el archivo
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          // Parsear el JSON
          const importedProducts = JSON.parse(event.target.result);
          
          if (!Array.isArray(importedProducts)) {
            throw new Error('El formato del archivo no es válido');
          }
          
          // Confirmar la importación
          if (window.confirm(`¿Importar ${importedProducts.length} productos? Esto actualizará los productos existentes y añadirá los nuevos.`)) {
            // Procesar cada producto
            for (const product of importedProducts) {
              if (product._id) {
                // Actualizar producto existente
                await axios.put(`/products/${product._id}`, product, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              } else {
                // Crear nuevo producto
                await axios.post('/products', product, {
                  headers: { Authorization: `Bearer ${token}` }
                });
              }
            }
            
            // Recargar productos
            const res = await axios.get('/products');
            setProducts(res.data);
            
            alert('Productos importados correctamente');
          }
        } catch (error) {
          console.error('Error al procesar el archivo:', error);
          alert('Error al procesar el archivo. Asegúrate de que es un JSON válido.');
        } finally {
          setImporting(false);
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error al importar productos:', error);
      alert('Error al importar productos');
      setImporting(false);
    }
  };

  // Crear un archivo de plantilla para nuevos productos
  const handleCreateTemplate = () => {
    const template = [
      {
        "name": "Nombre del Producto",
        "description": "Descripción del producto",
        "price": "99.99",
        "image": "URL de la imagen"
      },
      {
        "name": "Otro Producto",
        "description": "Otra descripción",
        "price": "149.99",
        "image": "URL de la imagen"
      }
    ];
    
    const data = JSON.stringify(template, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla-productos.json';
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-bold text-[#7b3f00] mb-3">Gestión de Datos</h3>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExport}
          className="bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md py-2 px-4 font-semibold cursor-pointer hover:opacity-90"
        >
          Exportar Productos
        </button>
        
        <label className="bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md py-2 px-4 font-semibold cursor-pointer hover:opacity-90">
          {importing ? 'Importando...' : 'Importar Productos'}
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={importing}
            className="hidden"
          />
        </label>
        
        <button
          onClick={handleCreateTemplate}
          className="bg-gray-200 text-[#7731c6] border-none rounded-md py-2 px-4 font-semibold cursor-pointer hover:bg-gray-300"
        >
          Crear Plantilla
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mt-3">
        Exporta tus productos para editarlos en tu PC y luego importarlos de nuevo.
        La plantilla te ayuda a crear nuevos productos con el formato correcto.
      </p>
    </div>
  );
}
