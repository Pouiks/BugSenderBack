// controllers/userController.js
const connectDB = require('../config/db');  // Importation de la connexion à la base de données

// Obtenir tous les utilisateurs
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

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { email, username, role, password } = req.body;
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    const user = {
      email,
      username,
      role,
      password,  // Assurez-vous que le mot de passe est hashé avant l'insertion
      license: {
        licenseKey: "DEFAULT_LICENSE_KEY",  // Utiliser une valeur par défaut ou une logique pour générer la clé
        startDate: new Date().toISOString(),  // Date de début
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),  // Date de fin de validité par défaut à 1 an
        status: "active"
      }
    };

    const result = await usersCollection.insertOne(user);
    res.status(201).json({ message: 'Utilisateur créé avec succès', userId: result.insertedId });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, username, role, password, license } = req.body;  // Les champs que vous souhaitez mettre à jour
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    const updateData = {
      ...(email && { email }),
      ...(username && { username }),
      ...(role && { role }),
      ...(password && { password }),  // Assurez-vous que le mot de passe est hashé
      ...(license && { license })
    };

    await usersCollection.updateOne({ _id: new mongodb.ObjectId(userId) }, { $set: updateData });
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
  }
};
