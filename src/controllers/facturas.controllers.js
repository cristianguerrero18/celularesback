// server/controllers/libros.controller.js
import Factura from '../models/facturas.model.js';
import Compra from '../models/compra.model.js';
import mongoose from 'mongoose';
import DetalleCompra from '../models/detalle_compra.model.js';

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

        // 1. Encontrar todas las compras del usuario (su id_usuario es un String en tu modelo)
        const comprasUsuario = await Compra.find({ id_usuario: id_usuario }).lean();

        if (comprasUsuario.length === 0) {
            return res.status(200).json([]); // No hay compras para este usuario
        }

        // Extraer los id_compra como Strings (ya que así están en tu base de datos)
        const idsCompras = comprasUsuario.map(c => c._id.toString()); 

        // 2. Buscar facturas asociadas a esas compras (el id_compra de Factura es un String)
        const facturas = await Factura.find({ id_compra: { $in: idsCompras } }).lean();

        // 3. Para cada factura, encontrar sus detalles de compra
        const facturasConDetalles = await Promise.all(facturas.map(async (factura) => {
            // Asumiendo que factura.id_compra es el ID de la Compra como String
            const detallesCompra = await DetalleCompra.find({ id_compra: factura.id_compra }).lean();

            // Aquí, 'detallesCompra' contendrá:
            // { id_compra: 'string', id_producto: 'string', cantidad: number, precio_unitario: number }
            // No tendrás directamente el nombre del producto aquí, solo su ID.

            // Formatear los detalles para la respuesta final
            const detallesFormateados = detallesCompra.map(detalle => ({
                id_detalle: detalle._id.toString(), // Convertir a string para consistencia
                id_producto: detalle.id_producto || 'ID_PRODUCTO_NO_ESPECIFICADO', // id del producto
                cantidad: detalle.cantidad || 0,
                precio_unitario: detalle.precio_unitario || 0,
                // Calcular subtotal si no viene en el detalle_compra
                subtotal: (detalle.cantidad || 0) * (detalle.precio_unitario || 0)
            }));

            // Combinar la factura con sus detalles de compra
            return {
                ...factura, // Copia todas las propiedades de la factura
                detalles_compra: detallesFormateados, // Añade los detalles de compra
            };
        }));

        res.status(200).json(facturasConDetalles);

    } catch (error) {
        console.error('Error al obtener facturas del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener facturas del usuario.' });
    }
};
