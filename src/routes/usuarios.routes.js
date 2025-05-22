import express from 'express';
import * as usuariosController from '../controllers/usuarios.controllers.js';

const router = express.Router();

// Rutas específicas primero
router.get('/email/:email', usuariosController.obtenerIdPorEmail);
router.get('/nombre/:nombre', usuariosController.obtenerUsuariosPorNombre);

// Rutas generales después
router.get('/', usuariosController.obtenerUsuarios);
router.get('/:id', usuariosController.obtenerUsuarioPorId);
router.post('/', usuariosController.crearUsuario);
router.delete('/:id', usuariosController.eliminarUsuario);
router.put('/:id', usuariosController.editarUsuario);
router.post('/login', usuariosController.loginUsuario);

export default router;
