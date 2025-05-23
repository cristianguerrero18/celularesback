import express from 'express';
const router = express.Router();
import * as productosController from '../controllers/productos.controllers.js';

router.get('/', productosController.obtenerProductos);
router.post('/', productosController.nuevoProducto); // Ruta para crear un nuevo producto
router.get('/:id', productosController.obtenerProductoPorId); 
router.delete('/:id', productosController.eliminarProducto);
router.put('/:id', productosController.editarProducto);

export default router;
