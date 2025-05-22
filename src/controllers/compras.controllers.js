// server/controllers/compras.controller.js
import Compra from '../models/compra.model.js';
import DetalleCompra from '../models/detalle_compra.model.js';
import Producto from '../models/productos.model.js';
import mongoose from 'mongoose';

export const crearCompra = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id_usuario, items } = req.body;

    if (!id_usuario || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Datos de compra inválidos' });
    }

    let total = 0;
    const productosIds = items.map(item => item.id_producto);

    const productos = await Producto.find({
      _id: { $in: productosIds }
    }).session(session);

    for (const item of items) {
      const producto = productos.find(p => p._id.equals(item.id_producto));

      if (!producto) {
        throw new Error(`Producto ${item.id_producto} no encontrado`);
      }

      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${producto.nombre}`);
      }

      total += producto.precio_unitario * item.cantidad;
    }

    const nuevaCompra = new Compra({
      id_usuario,
      fecha_compra: new Date(),
      total,
      estado: 'completado'
    });

    const compraGuardada = await nuevaCompra.save({ session });

    const detallesCompra = await Promise.all(
      items.map(async item => {
        const producto = productos.find(p => p._id.equals(item.id_producto));

        producto.stock -= item.cantidad;
        await producto.save({ session });

        const detalle = new DetalleCompra({
          id_compra: compraGuardada._id,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: producto.precio_unitario
        });

        return await detalle.save({ session });
      })
    );

    await session.commitTransaction();
    res.status(201).json({
      compra: compraGuardada,
      detalles: detallesCompra
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error en crearCompra:', error);
    res.status(500).json({
      message: 'Error al procesar la compra',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

export const obtenerCompras = async (req, res) => {
  try {
    const compras = await Compra.find({});
    res.status(200).json(compras);
  } catch (err) {
    res.status(500).send('Error al obtener las compras');
  }
};

export const obtenerCompraConDetalles = async (req, res) => {
  try {
    const { id } = req.params;
    const compra = await Compra.findById(id);
    const detalles = await DetalleCompra.find({ id_compra: id });
    res.status(200).json({ compra, detalles });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener la compra con sus detalles');
  }
};

export const obtenerComprasConDetallesPorUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.status(400).json({ message: 'ID de usuario requerido' });
    }

    const compras = await Compra.find({ id_usuario });

    const comprasConDetalles = await Promise.all(
      compras.map(async compra => {
        const detalles = await DetalleCompra.find({ id_compra: compra._id });
        return {
          compra,
          detalles
        };
      })
    );

    res.status(200).json(comprasConDetalles);
  } catch (error) {
    console.error('Error al obtener compras con detalles por usuario:', error);
    res.status(500).json({ message: 'Error al obtener las compras', error: error.message });
  }
};
