const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const mongodb = require('mongodb');

// Méthode d'enregistrement d'utilisateur
exports.registerUser = async (req, res) => {
  try {
    const { email, password, role, domain } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    const user = await usersCollection.insertOne({ email, passwordHash: hashedPassword, role, domain });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration', error });
  }
};

// Méthode de connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    const db = await connectDB();
    const userCollection = db.collection('Users');

    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { userId: user._id, role: user.role, domain: user.domain },
      process.env.JWT_TOKEN,
      { expiresIn: '1h' }
    );

    // Définir le token comme un cookie HttpOnly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Utiliser HTTPS en production
      maxAge: 3600000, // 1 heure
      sameSite: 'Strict', // Empêcher l'envoi de cookies avec des requêtes cross-site
    });

    res.status(200).json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        domain: user.domain
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

// Méthode de récupération du profil utilisateur
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Récupération de l'ID utilisateur à partir du token
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    
    const user = await usersCollection.findOne({ _id: new mongodb.ObjectId(userId) });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({
      id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      domain: user.domain,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération du profil utilisateur' });
  }
};

// Méthode de déconnexion
exports.logout = (req, res) => {
  res.clearCookie('token'); // Efface le cookie JWT
  res.status(200).json({ message: 'Déconnexion réussie' });
};
