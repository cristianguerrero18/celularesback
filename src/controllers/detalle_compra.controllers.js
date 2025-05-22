
import DetalleCompra from '../models/detalle_compra.model.js';
import mongoose from 'mongoose';

const obtenerDetalle_Compras = async (req, res) => {
  try {
    const detalle_compras = await DetalleCompra.find({});
    res.status(200).json(detalle_compras);
  } catch (err) {
    res.status(500).send('Error al obtener los detalles');
  }
};

const obtenerDetallePorCompra = async (req, res) => {
  try {
    const { id_compra } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_compra)) {
      return res.status(400).json({ message: 'ID de compra no válido' });
    }

    const detalle_compras = await DetalleCompra.find({ id_compra });

    res.status(200).json(detalle_compras);
  } catch (err) {
    console.error('Error al obtener detalles por compra:', err);
    res.status(500).send('Error al obtener los detalles de la compra');
  }
};

export {
  obtenerDetalle_Compras,
  obtenerDetallePorCompra
};
