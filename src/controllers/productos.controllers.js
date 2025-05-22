
import Producto from '../models/productos.model.js';
import mongoose from 'mongoose';

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await Producto.find({});
    res.status(200).json(productos);
  } catch (err) {
    res.status(500).send('Error al obtener los productos');
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID de producto no válido');
    }

    const producto = await Producto.findById(id);

    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }

    res.status(200).json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el producto');
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID de producto no válido');
    }

    const productoEliminado = await Producto.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).send('Producto no encontrado');
    }

    res.status(200).send('Producto eliminado correctamente');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el producto');
  }
};

export const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send('ID de producto no válido');
    }

    const { nombre, marca, modelo, descripcion, precio_unitario, stock, imagen } = req.body;

    if (!nombre || !marca || !modelo || precio_unitario === undefined || stock === undefined) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    const updateData = {
      nombre,
      marca,
      modelo,
      descripcion: descripcion || '',
      precio_unitario,
      stock,
      imagen: imagen || ''
    };

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!productoActualizado) {
      return res.status(404).send('Producto no encontrado');
    }

    res.status(200).json(productoActualizado);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al editar el producto');
  }
};
