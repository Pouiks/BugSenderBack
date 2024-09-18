// controllers/userController.js
const connectDB = require('../config/db');
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    const users = await usersCollection.find().toArray();
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs", error: error.message });
  }
};

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { email, username } = req.body;
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      console.log("l'email existe déja")
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }
    
    // Insérer l'utilisateur dans la base de données
    const newUser = { ...req.body, createdAt: new Date() };
    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: result.ops[0] });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
};






// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, username, role, password, domain } = req.body;
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    const updateData = {
      ...(email && { email }),
      ...(username && { username }),
      ...(role && { role }),
      ...(password && { passwordHash: await bcrypt.hash(password, 10) }),
      ...(domain && { domain })
    };

    await usersCollection.updateOne({ _id: new mongodb.ObjectId(userId) }, { $set: updateData });
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
  }
};

// Fonction pour obtenir le profil de l'utilisateur
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
