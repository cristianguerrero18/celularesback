// server/config/database.js
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://prueba756:iELxYb0lkNhd0LDA@cluster1.h2psq9v.mongodb.net/celulares';
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB conectado exitosamente');
  } catch (err) {
    console.error('Error al conectar MongoDB:', err);
    process.exit(1);
  }
};

export default connectDB;
