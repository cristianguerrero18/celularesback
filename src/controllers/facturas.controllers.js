// server/controllers/libros.controller.js
import Factura from '../models/facturas.model.js';
import Compra from '../models/compra.model.js';
import mongoose from 'mongoose';
import DetalleCompra from '../models/detalle_compra.model.js';
import Usuario from '../models/usuarios.model.js';


// Obtener todas las facturas
export const obtenerFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find({});
    res.status(200).json(facturas);
  } catch (err) {
    res.status(500).send('Error al obtener las facturas');
  }
};

// Crear una nueva factura
export const crearFactura = async (req, res) => {
  try {
    const { id_compra, numero_factura, fecha_emision, total } = req.body;

    const nuevaFactura = new Factura({
      id_compra,
      numero_factura,
      fecha_emision,
      total
    });

    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    console.error('Error al crear factura:', error);
    res.status(500).send('Error al crear la factura');
  }
};

export const obtenerFacturasPorUsuario = async (req, res) => {
  try {
      const { id_usuario } = req.params;

      if (!id_usuario) {
          return res.status(400).json({ message: 'ID de usuario requerido.' });
      }

      // Obtener datos del usuario (nombre y cédula)
      const usuario = await Usuario.findById(id_usuario).lean();
      if (!usuario) {
          return res.status(404).json({ message: 'Usuario no encontrado.' });
      }

      const comprasUsuario = await Compra.find({ id_usuario }).lean();
      if (comprasUsuario.length === 0) {
          return res.status(200).json([]); // No hay compras para este usuario
      }

      const idsCompras = comprasUsuario.map(c => c._id.toString());

      const facturas = await Factura.find({ id_compra: { $in: idsCompras } }).lean();

      const facturasConDetalles = await Promise.all(facturas.map(async (factura) => {
          const detallesCompra = await DetalleCompra.find({ id_compra: factura.id_compra }).lean();

          const detallesFormateados = detallesCompra.map(detalle => ({
              id_detalle: detalle._id.toString(),
              id_producto: detalle.id_producto || 'ID_PRODUCTO_NO_ESPECIFICADO',
              cantidad: detalle.cantidad || 0,
              precio_unitario: detalle.precio_unitario || 0,
              subtotal: (detalle.cantidad || 0) * (detalle.precio_unitario || 0)
          }));

          return {
              ...factura,
              nombre_usuario: usuario.nombre,
              cedula_usuario: usuario.cedula,
              detalles_compra: detallesFormateados
          };
      }));

      res.status(200).json(facturasConDetalles);

  } catch (error) {
      console.error('Error al obtener facturas del usuario:', error);
      res.status(500).json({ message: 'Error interno del servidor al obtener facturas del usuario.' });
  }
};


export const obtenerFacturaPorId = async (req, res) => {
  try {
    const { id_factura } = req.params;

    if (!id_factura || !mongoose.Types.ObjectId.isValid(id_factura)) {
      return res.status(400).json({ message: 'ID de factura inválido o no proporcionado.' });
    }

    // 1. Encontrar la factura por su _id
    const factura = await Factura.findById(id_factura).lean();

    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada.' });
    }

    // 2. Obtener la compra asociada a la factura para extraer el id_usuario
    const compra = await Compra.findById(factura.id_compra).lean();

    // 3. Buscar los detalles de compra asociados a esta factura
    // Asumiendo que factura.id_compra es el ID de la Compra como String
    const detallesCompra = await DetalleCompra.find({ id_compra: factura.id_compra }).lean();

    // Formatear los detalles para la respuesta final
    const detallesFormateados = detallesCompra.map(detalle => ({
      id_detalle: detalle._id.toString(), // Convertir a string para consistencia
      id_producto: detalle.id_producto || 'ID_PRODUCTO_NO_ESPECIFICADO',
      cantidad: detalle.cantidad || 0,
      precio_unitario: detalle.precio_unitario || 0,
      subtotal: (detalle.cantidad || 0) * (detalle.precio_unitario || 0)
    }));

    // Combinar la factura con sus detalles de compra y el id_usuario de la compra
    const facturaConDetalles = {
      ...factura, // Copia todas las propiedades de la factura
      id_usuario: compra ? compra.id_usuario : null, // Add the user ID from the purchase
      detalles_compra: detallesFormateados, // Añade los detalles de compra
    };

    res.status(200).json(facturaConDetalles);

  } catch (error) {
    console.error('Error al obtener factura por ID:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener la factura por ID.' });
  }
};
