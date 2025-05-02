import React, { useEffect, useState } from 'react';
import axios from '../config/axios';
import ProductCard from '../components/ProductCard';

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
    <div style={{padding:24}}>
      <div style={{display:'flex', marginBottom:24}}>
        <button onClick={() => handleTab(TABS.USER)} style={{marginRight:8, fontWeight: tab===TABS.USER?'bold':'normal'}}>Productos</button>
        {user?.isAdmin && <button onClick={() => handleTab(TABS.ADMIN)} style={{fontWeight: tab===TABS.ADMIN?'bold':'normal'}}>Administrar</button>}
      </div>
      {tab === TABS.USER && (
        <div style={{display:'flex', flexWrap:'wrap'}}>
          {products.map(prod => (
            <ProductCard key={prod._id} product={prod} isAdmin={false} />
          ))}
        </div>
      )}
      {tab === TABS.ADMIN && user?.isAdmin && (
        <div style={{marginTop:32, background:'#fff', borderRadius:12, boxShadow:'0 2px 16px #e2c9a0', padding:32, maxWidth:950}}>
          <h2 style={{fontFamily:'serif',fontWeight:700,fontSize:32,marginBottom:24,color:'#7b3f00'}}>Administrar productos</h2>
          <form onSubmit={handleFormSubmit} style={{display:'flex',gap:14,alignItems:'center',marginBottom:32,flexWrap:'wrap'}}>
            <input type="text" name="name" value={form.name} onChange={handleFormChange} placeholder="Nombre" required style={{flex:'1 1 160px',padding:12,borderRadius:6,border:'1px solid #ccc',fontSize:16}} />
            <input type="text" name="description" value={form.description} onChange={handleFormChange} placeholder="Descripción" required style={{flex:'2 1 260px',padding:12,borderRadius:6,border:'1px solid #ccc',fontSize:16}} />
            <input type="number" name="price" value={form.price} onChange={handleFormChange} placeholder="Precio" required style={{flex:'0 1 100px',padding:12,borderRadius:6,border:'1px solid #ccc',fontSize:16}} />
            <input type="text" name="image" value={form.image} onChange={handleFormChange} placeholder="URL Imagen" style={{flex:'2 1 240px',padding:12,borderRadius:6,border:'1px solid #ccc',fontSize:16}} />
            <button type="submit" style={{padding:'12px 24px',background:'#7b3f00',color:'#fff',border:'none',borderRadius:6,fontWeight:'bold',fontSize:16,cursor:'pointer',height:48}}>{editing ? 'Actualizar' : 'Crear'}</button>
            {editing && <button type="button" onClick={()=>{setEditing(null);setForm({name:'',description:'',price:'',image:''});}} style={{padding:'12px 18px',background:'#eee',color:'#7b3f00',border:'none',borderRadius:6,fontWeight:'bold',fontSize:16,cursor:'pointer',height:48}}>Cancelar</button>}
          </form>
          <div style={{display:'flex', flexWrap:'wrap'}}>
            {products.map(prod => (
              <ProductCard key={prod._id} product={prod} isAdmin={true} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
