// controllers/userController.js
const bcrypt = require('bcrypt');
const mongodb = require('mongodb'); // Ajouté pour l'utilisation des ObjectId
const connectDB = require('../config/db');  // Importation de la connexion à la base de données

// Obtenir tous les utilisateurs (uniquement pour les administrateurs)
exports.getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');  // Accéder à la collection 'Users'
    const users = await usersCollection.find().toArray();  // Récupérer tous les utilisateurs
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs", error: error.message });
  }
};

// Création d'un nouvel utilisateur par un administrateur
exports.createUser = async (req, res) => {
  const { username, email, password, role, domain } = req.body;

  try {
    const db = await connectDB();
    const userCollection = db.collection('Users');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = {
      username,
      email,
      password: hashedPassword,
      role,
      domain,
      createdAt: new Date(),
    };

    const result = await userCollection.insertOne(newUser);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      userId: result.insertedId,
      user: newUser,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
};

// Mise à jour d'un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, username, role, password, domain, license } = req.body;  // Les champs que vous souhaitez mettre à jour
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    const updateData = {
      ...(email && { email }),
      ...(username && { username }),
      ...(role && { role }),
      ...(domain && { domain }), // Mise à jour du domaine
      ...(password && { password: await bcrypt.hash(password, 10) }),  // Assurez-vous que le mot de passe est hashé
      ...(license && { license })
    };

    await usersCollection.updateOne({ _id: new mongodb.ObjectId(userId) }, { $set: updateData });
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
  }
};

exports.updateOwnProfile = async (req, res) => {
  try {
    const userId = req.userId; // Récupérer l'ID de l'utilisateur connecté
    const { email, username, password } = req.body; // Champs modifiables par l'utilisateur
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    const updateData = {
      ...(email && { email }),
      ...(username && { username }),
      ...(password && { password: await bcrypt.hash(password, 10) }), // Hashage du mot de passe si modifié
    };

    await usersCollection.updateOne({ _id: new mongodb.ObjectId(userId) }, { $set: updateData });
    res.status(200).json({ message: 'Profil mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du profil' });
  }
};
