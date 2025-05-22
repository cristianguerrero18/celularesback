
import mongoose from 'mongoose';

const FacturaSchema = new mongoose.Schema({
  id_compra: { type: String, required: true },
  numero_factura: { type: String, required: true },
  fecha_emision: Date,
  total: Number
});

const Factura = mongoose.model('factura', FacturaSchema);
export default Factura;
