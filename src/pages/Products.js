import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import ProductCard from '../components/ProductCard';
import CloudinaryUploader from '../components/CloudinaryUploader';
import ProductDataManager from '../components/ProductDataManager';
import backgroundImage from '../assets/images/cup-coffee.jpg';
import { getLocalProducts, addLocalProduct, updateLocalProduct, deleteLocalProduct } from '../utils/localStorageManager';

const TABS = {
  USER: 'Productos',
  ADMIN: 'Administrar'
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState(TABS.USER);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '' });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    // Cargar productos desde el servidor
    axios.get('/products')
      .then(res => {
        setProducts(res.data);
      })
      .catch(error => {
        console.error('Error al cargar productos desde el servidor:', error);
        // Si hay error, cargar productos desde localStorage
        const localProducts = getLocalProducts();
        setProducts(localProducts);
        console.log('Cargados productos desde almacenamiento local:', localProducts.length);
      });
      
    // Obtener usuario logueado
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleTab = (t) => setTab(t);

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({ name: product.name, description: product.description, price: product.price, image: product.image });
    setImagePreview(product.image);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    
    try {
      // Verificar si es un producto local (ID comienza con 'local_')
      if (id.startsWith('local_')) {
        // Eliminar del almacenamiento local
        deleteLocalProduct(id);
        setProducts(products.filter(p => p._id !== id));
        return;
      }
      
      // Eliminar del servidor
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto. Se eliminará localmente.');
      
      // Si hay error, eliminar localmente
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleImageUploaded = (imageUrl) => {
    setForm({ ...form, image: imageUrl });
    setImagePreview(imageUrl);
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    
    // Validar que los campos requeridos estén completos
    if (!form.name || !form.description || !form.price) {
      alert('Por favor completa los campos obligatorios: Nombre, Descripción y Precio');
      return;
    }
    
    // Preparar datos para enviar
    const productData = {
      name: form.name,
      description: form.description,
      price: form.price,
      image: form.image
    };
    
    try {
      // Configurar headers
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      let res;
      if (editing) {
        // Verificar si es un producto local
        if (editing.startsWith('local_')) {
          // Actualizar en almacenamiento local
          const updatedProduct = updateLocalProduct(editing, productData);
          setProducts(products.map(p => p._id === editing ? updatedProduct : p));
          setEditing(null);
          alert('Producto actualizado localmente');
        } else {
          // Actualizar en el servidor
          try {
            res = await axios.put(`/products/${editing}`, productData, config);
            setProducts(products.map(p => p._id === editing ? res.data : p));
            setEditing(null);
            alert('Producto actualizado correctamente');
          } catch (serverError) {
            console.error('Error al actualizar en servidor:', serverError);
            // Si hay error con el servidor, actualizar localmente
            const updatedProduct = updateLocalProduct(editing, productData);
            setProducts(products.map(p => p._id === editing ? updatedProduct : p));
            setEditing(null);
            alert('No se pudo conectar con el servidor. Producto actualizado localmente.');
          }
        }
      } else {
        // Crear producto
        try {
          // Intentar crear en el servidor
          res = await axios.post('/products', productData, config);
          setProducts([...products, res.data]);
          alert('Producto creado correctamente');
        } catch (serverError) {
          console.error('Error al crear en servidor:', serverError);
          // Si hay error con el servidor, crear localmente
          const newProduct = addLocalProduct(productData);
          setProducts([newProduct, ...products]);
          alert('No se pudo conectar con el servidor. Producto guardado localmente.');
        }
      }
      
      // Limpiar formulario
      setForm({ name: '', description: '', price: '', image: '' });
      setImagePreview('');
    } catch (error) {
      console.error('Error general al guardar producto:', error);
      alert('Error al procesar el producto: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen relative" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
      {/* Overlay para difuminar la imagen */}
      <div className="absolute inset-0 md:backdrop-blur-[1px] lg:bg-opacity-20 lg:backdrop-blur-[1px]"></div>
      
      {/* Contenido */}
      <div className="relative z-10 px-4 py-6">
        <div className="flex mb-6">
        
          {user?.isAdmin && 
            <button 
              onClick={() => handleTab(TABS.ADMIN)} 
              className={`${tab === TABS.ADMIN ? 'font-bold' : 'font-normal'} hover:text-[#7b3f00]`}
            >
              Administrar
            </button>
          }
        </div>
        
        {tab === TABS.USER && (
          <div className="flex flex-wrap justify-center">
            {products.map(prod => (
              <ProductCard key={prod._id} product={prod} isAdmin={false} />
            ))}
          </div>
        )}
        
        {tab === TABS.ADMIN && user?.isAdmin && (
          <div className="mt-8 bg-white rounded-xl shadow-lg shadow-[#e2c9a0]/50 p-8 max-w-[950px] mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold text-[#7b3f00] mb-3">Modo de trabajo</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${products.some(p => p.isLocal) ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {products.some(p => p.isLocal) ? 'Algunos productos guardados localmente' : 'Todos los productos sincronizados'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Puedes gestionar tus productos incluso cuando el servidor no esté disponible. 
                Los cambios se guardarán localmente y podrás sincronizarlos más tarde.
              </p>
            </div>
            <ProductDataManager products={products} setProducts={setProducts} token={token} />
            <h2 className="font-serif font-bold text-3xl mb-6 text-[#7b3f00]">Administrar productos</h2>
            
            <form onSubmit={handleFormSubmit} className="flex gap-3.5 items-center mb-8 flex-wrap">
              <input 
                type="text" 
                name="name" 
                value={form.name} 
                onChange={handleFormChange} 
                placeholder="Nombre" 
                required 
                className="flex-1 basis-[160px] p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
              />
              <input 
                type="text" 
                name="description" 
                value={form.description} 
                onChange={handleFormChange} 
                placeholder="Descripción" 
                required 
                className="flex-2 basis-[260px] p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
              />
              <input 
                type="number" 
                name="price" 
                value={form.price} 
                onChange={handleFormChange} 
                placeholder="Precio" 
                required 
                className="flex-none basis-[100px] p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
              />
              <div className="flex-2 basis-[240px] flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <CloudinaryUploader onImageUploaded={handleImageUploaded} />
                  <input 
                    type="text" 
                    name="image" 
                    value={form.image} 
                    onChange={handleFormChange} 
                    placeholder="URL Imagen" 
                    className="flex-1 p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
                  />
                </div>
                {imagePreview && (
                  <div className="relative w-20 h-20 mt-1">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover rounded-md border border-gray-300" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm({...form, image: ''});
                        setImagePreview('');
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="py-3 px-6 bg-gradient-to-r from-purple-500 to-purple-900 text-white border-none rounded-md font-bold text-base cursor-pointer h-12 hover:bg-[#6a3500] transition-colors"
              >
                {editing ? 'Actualizar' : 'Crear'}
              </button>
              {editing && 
                <button 
                  type="button" 
                  onClick={() => {
                    setEditing(null);
                    setForm({name:'',description:'',price:'',image:''});
                  }} 
                  className="py-3 px-4.5 bg-gray-200 text-[#7731c6] border-none rounded-md font-bold text-base cursor-pointer h-12 hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              }
            </form>
            
            <div className="flex flex-wrap justify-center">
              {products.map(prod => (
                <ProductCard key={prod._id} product={prod} isAdmin={true} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
