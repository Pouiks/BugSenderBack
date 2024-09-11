const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bugRoutes = require('./routes/bugRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');  // Ajout des routes des utilisateurs
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['chrome-extension://ekkekjfbiokljeofbaehnencomknhlla',"http://localhost:5173", "chrome-extension://igolmegnbbgomaddaomlgklhccdpdock"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use('/api/bugs', bugRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);  // Déclare la route utilisateur

async function startServer() {
  try {
    await connectDB();  // Connectez à la base de données une seule fois
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
