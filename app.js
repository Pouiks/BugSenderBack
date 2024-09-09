const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bugRoutes = require('./routes/bugRoutes');
const authRoutes = require('./routes/authRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'chrome-extension://igolmegnbbgomaddaomlgklhccdpdock',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

app.use(express.json()); // Pour parser le corps des requêtes JSON

// Déclarez les routes API
app.use('/api/bugs', bugRoutes);  // Les requêtes vers /api/bugs utiliseront bugRoutes
app.use('/api/auth', authRoutes); // Les requêtes vers /api/auth utiliseront authRoutes

async function startServer() {
  try {
    await connectDB();  // Connexion à la base de données une seule fois
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
