// server/models/libro.model.js
import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  marca: String,
  modelo: String,
  descripcion: String,
  precio_unitario: Number,
  stock: Number,
  imagen: String,
  fecha_creacion: Date
});
export default mongoose.model('producto', ProductoSchema);
