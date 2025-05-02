import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST' && req.query.action === 'register') {
    const { name, email, password, isAdmin } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashed, isAdmin: !!isAdmin });
      await user.save();
      return res.json({ msg: 'Usuario registrado correctamente.' });
    } catch {
      return res.status(500).json({ msg: 'Error al registrar el usuario.' });
    }
  }

  if (req.method === 'POST' && req.query.action === 'login') {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Usuario no encontrado.' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ msg: 'Contraseña incorrecta.' });
      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
    } catch {
      return res.status(500).json({ msg: 'Error al iniciar sesión.' });
    }
  }

  res.status(405).json({ msg: 'Método o acción no permitida' });
}
