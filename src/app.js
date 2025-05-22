import express from 'express';
import cors from 'cors';
import connectDB from './db/database.js';
import UsuarioRoutes from './routes/usuarios.routes.js';
import ProductosRoutes from './routes/productos.routes.js'
import ComprasRoutes from './routes/compras.routes.js'
import Detalle_comprasRoutes from './routes/detalle_compras.routes.js'
import FacturasRoutes from './routes/facturas.routes.js'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/usuarios', UsuarioRoutes);
app.use('/api/productos', ProductosRoutes);
app.use('/api/compras', ComprasRoutes);
app.use('/api/detalle_compras', Detalle_comprasRoutes);
app.use('/api/facturas', FacturasRoutes);


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

export default app;