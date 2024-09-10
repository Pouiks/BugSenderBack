// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');

// Enregistrement (Inscription) d'un nouvel utilisateur
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, role, domain } = req.body; // Ajoutez le nom de domaine à l'enregistrement
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }

    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
      domain,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({
      message: 'Utilisateur enregistré avec succès',
      user: { ...newUser, id: result.insertedId },
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ message: 'Erreur lors de l\'enregistrement', error });
  }
};

// Connexion de l'utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await connectDB();
    const userCollection = db.collection('Users');

    // Trouver l'utilisateur par email
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparer le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT incluant le rôle et le domaine de l'utilisateur
    const token = jwt.sign(
      { userId: user._id, role: user.role, domain: user.domain },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        domain: user.domain, // Inclure le domaine de l'utilisateur
      },
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};

// Récupérer le profil utilisateur connecté
exports.getUserProfile = async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    const user = await usersCollection.findOne({ _id: req.userId });
    res.json({ user });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil de l\'utilisateur', error });
  }
};
