import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json(products);
    } catch {
      return res.status(500).json({ msg: 'Error al obtener los productos.' });
    }
  }

  if (req.method === 'POST') {
    const { name, description, price, image } = req.body;
    if (!name || !description || !price)
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    try {
      const newProduct = new Product({ name, description, price, image });
      await newProduct.save();
      return res.json(newProduct);
    } catch {
      return res.status(500).json({ msg: 'Error al crear el producto.' });
    }
  }

  if (req.method === 'PUT') {
    const { id, name, description, price, image } = req.body;
    if (!id || !name || !description || !price)
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    try {
      const updated = await Product.findByIdAndUpdate(id, { name, description, price, image }, { new: true });
      return res.json(updated);
    } catch {
      return res.status(500).json({ msg: 'Error al actualizar el producto.' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    if (!id) return res.status(400).json({ msg: 'ID requerido.' });
    try {
      await Product.findByIdAndDelete(id);
      return res.json({ msg: 'Producto eliminado.' });
    } catch {
      return res.status(500).json({ msg: 'Error al eliminar el producto.' });
    }
  }

  res.status(405).json({ msg: 'Método no permitido' });
}
