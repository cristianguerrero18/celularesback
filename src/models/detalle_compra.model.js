// models/detalle_compra.model.js
import mongoose from 'mongoose';

const DetalleCompraSchema = new mongoose.Schema({
  id_compra: { type: String, required: true },
  id_producto: String,
  cantidad: Number,
  precio_unitario: Number,
});
export default mongoose.model('detalle_compra', DetalleCompraSchema);