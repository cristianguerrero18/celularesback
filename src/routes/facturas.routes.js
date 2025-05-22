
import express from 'express';
const router = express.Router();
import * as facturasController  from '../controllers/facturas.controllers.js'

router.get('/', facturasController.obtenerFacturas);
router.post('/', facturasController.crearFactura);
router.get('/usuario/:id_usuario', facturasController.obtenerFacturasPorUsuario);



export default router;