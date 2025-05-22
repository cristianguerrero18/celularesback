// routes/detalle_compra.routes.js
import express from 'express';
import {
  obtenerDetalle_Compras,
  obtenerDetallePorCompra
} from '../controllers/detalle_compra.controllers.js';

const router = express.Router();

router.get('/', obtenerDetalle_Compras);
router.get('/:id_compra', obtenerDetallePorCompra);

export default router;
