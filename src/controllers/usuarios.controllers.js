// server/controllers/libros.controller.js
import Usuario from '../models/usuarios.model.js';
import mongoose from 'mongoose';

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({});
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).send('Error al obtener los usuarios');
  }
};

export const crearUsuario = async (req, res) => {
  try {
    if (!req.body.nombre || !req.body.email || !req.body.password || !req.body.cedula) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    const nuevoUsuario = new Usuario({
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password, // En producción, hashear la contraseña
      direccion: req.body.direccion || '',
      telefono: req.body.telefono || '',
      tipo: req.body.tipo || 'cliente',
      cedula: req.body.cedula
    });

    const usuarioGuardado = await nuevoUsuario.save();
    res.status(201).json(usuarioGuardado);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send('El email o cédula ya están registrados');
    } else {
      res.status(500).send('Error al crear el usuario');
    }
  }
};

export const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const usuario = await Usuario.findById(id);

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.status(200).json(usuario);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el usuario');
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    if (!usuarioEliminado) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.status(200).send('Usuario eliminado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el usuario');
  }
};

export const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID de usuario no válido');
    }

    const { nombre, email, password, direccion, telefono, tipo, cedula } = req.body;

    if (!nombre || !email || !cedula) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    const updateData = {
      nombre,
      email,
      direccion: direccion || '',
      telefono: telefono || '',
      tipo: tipo || 'cliente',
      cedula
    };

    if (password) {
      updateData.password = password;
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.status(200).json(usuarioActualizado);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      res.status(400).send('El email o cédula ya están registrados');
    } else {
      res.status(500).send('Error al editar el usuario');
    }
  }
};

export const obtenerIdPorEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado con ese email' });
    }

    res.status(200).json({ id: usuario._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener el ID del usuario por email' });
  }
};

export const obtenerUsuariosPorNombre = async (req, res) => {
  try {
    const { nombre } = req.params;

    if (!nombre) {
      return res.status(400).send('Falta el parámetro nombre');
    }

    const usuarios = await Usuario.find({ nombre });

    if (usuarios.length === 0) {
      return res.status(404).send('No se encontraron usuarios con ese nombre');
    }

    res.status(200).json(usuarios);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los usuarios por nombre');
  }
};


export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan email o password' });
    }

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      message: 'Login exitoso',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};