import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import ProductCard from '../components/ProductCard';
import backgroundImage from '../assets/images/cup-coffee.jpg';

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

  useEffect(() => {
    axios.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts([]));
    // Obtener usuario logueado
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleTab = (t) => setTab(t);

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({ name: product.name, description: product.description, price: product.price, image: product.image });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    await axios.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(products.filter(p => p._id !== id));
  };

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFormSubmit = async e => {
    e.preventDefault();
    if (editing) {
      // Actualizar producto
      const res = await axios.put(`/products/${editing}`, { ...form }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(p => p._id === editing ? res.data : p));
      setEditing(null);
    } else {
      // Crear producto
      const res = await axios.post('/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts([...products, res.data]);
    }
    setForm({ name: '', description: '', price: '', image: '' });
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
              <input 
                type="text" 
                name="image" 
                value={form.image} 
                onChange={handleFormChange} 
                placeholder="URL Imagen" 
                className="flex-2 basis-[240px] p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-[#7b3f00] focus:border-[#7b3f00]" 
              />
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
