import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

const ContactMessageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);

async function dbConnect() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ msg: 'Todos los campos son obligatorios.' });
    try {
      const newMsg = new ContactMessage({ name, email, message });
      await newMsg.save();
      return res.json({ msg: 'Mensaje recibido correctamente.' });
    } catch {
      return res.status(500).json({ msg: 'Error al guardar el mensaje.' });
    }
  }

  if (req.method === 'GET') {
    try {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      return res.json(messages);
    } catch {
      return res.status(500).json({ msg: 'Error al obtener los mensajes.' });
    }
  }

  res.status(405).json({ msg: 'Método no permitido' });
}
