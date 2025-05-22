// routes/compras.routes.js
import express from 'express';
import {
  obtenerCompras,
  obtenerCompraConDetalles,
  crearCompra,
  obtenerComprasConDetallesPorUsuario
} from '../controllers/compras.controllers.js';

const router = express.Router();

// Obtener todas las compras
router.get('/', obtenerCompras);

// Obtener una compra específica con sus detalles
router.get('/:id', obtenerCompraConDetalles);

// Crear una nueva compra
router.post('/', crearCompra);

// Obtener compras por ID de usuario
router.get('/usuario/:id_usuario', obtenerComprasConDetallesPorUsuario);

export default router;
