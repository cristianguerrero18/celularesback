// server/models/usuario.model.js
import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  direccion: String,
  telefono: String,
  tipo: { type: String, enum: ['admin', 'cliente'], default: 'cliente' },
  fecha_registro: { type: Date, default: Date.now },
  cedula: { type: String, required: true, unique: true }
});

export default mongoose.model('usuario', UsuarioSchema);




