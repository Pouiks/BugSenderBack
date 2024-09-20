const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser'); // Importer cookie-parser
const connectDB = require('./config/db');
const bugRoutes = require('./routes/bugRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: ['chrome-extension://kgpljjpjggbielmjjljcehnjbhiifdmj', "http://localhost:5173", "chrome-extension://igolmegnbbgomaddaomlgklhccdpdock", ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permettre l'envoi de cookies
}));

app.use(express.json({ limit: '10mb' }));  // Ajustez la taille à vos besoins
app.use(cookieParser()); // Utiliser le middleware pour parser les cookies

app.use('/api/bugs', bugRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

startServer();
