// server/models/usuario.model.js
import mongoose from 'mongoose';

const CompraSchema = new mongoose.Schema({
  id_usuario: { type: String, required: true},
  fecha_compra: Date,
  total: Number
});
export default mongoose.model('compra', CompraSchema);