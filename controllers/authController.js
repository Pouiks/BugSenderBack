const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const mongodb = require('mongodb');

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont requis.' });
    }

    const db = await connectDB();
    const userCollection = db.collection('Users');

    // Trouver l'utilisateur par email
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier que l'utilisateur a un mot de passe stocké dans la base de données
    if (!user.password) {
      return res.status(401).json({ message: 'Mot de passe non défini pour cet utilisateur.' });
    }

    // Comparer le mot de passe fourni avec le mot de passe hashé stocké
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
        domain: user.domain // Inclure le domaine de l'utilisateur
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};
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