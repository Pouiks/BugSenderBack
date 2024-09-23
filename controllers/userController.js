// controllers/userController.js
const connectDB = require('../config/db');
const bcrypt = require('bcrypt');
const mongodb = require('mongodb');
const crypto = require('crypto');  // Importer pour générer le token
const { sendPasswordSetupEmail } = require('../services/emailService');  // Importer le service pour l'envoi d'email
const { checkIfFolderExists, createDriveFolder } = require('../googleDriveService');  // Importer la vérification et création de dossier

// Créer un nouvel utilisateur
exports.createUser = async (req, res) => {
  try {
    const { email, username, domain } = req.body;
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Un utilisateur avec cet email existe déjà.' });
    }

    // Vérifier si le dossier Google Drive pour ce domaine existe déjà
    let folderId = await checkIfFolderExists(domain);
    if (!folderId) {
      folderId = await createDriveFolder(domain);
    }

    // Générer un token sécurisé pour la création de mot de passe
    const token = crypto.randomBytes(32).toString('hex');

    // Ajouter l'utilisateur dans la base de données avec le token et l'ID du dossier Drive
    const newUser = {
      email,
      username,
      domain,
      googleDriveFolderId: folderId,
      resetToken: token,
      resetTokenExpiry: Date.now() + 3600000,  // Token expire dans 1 heure
      createdAt: new Date(),
      password: null,  // Pas de mot de passe défini pour l'instant
    };

    const result = await usersCollection.insertOne(newUser);

    // Envoyer un email à l'utilisateur avec le lien de configuration du mot de passe
    await sendPasswordSetupEmail(email, token);

    res.status(201).json({ message: 'Utilisateur créé avec succès et email envoyé.', user: result.ops[0] });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
};

exports.updatePassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    // Trouver l'utilisateur par token
    const user = await usersCollection.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    
    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    // Hacher le mot de passe avec bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mettre à jour l'utilisateur avec le nouveau mot de passe
    await usersCollection.updateOne(
      { _id: new mongodb.ObjectId(user._id) },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }  // Supprimer le token et l'expiration
      }
    );

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};


// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    const users = await usersCollection.find().toArray(); // Récupérer tous les utilisateurs
    console.log('Utilisateurs récupérés:', users);

    // Assurez-vous de renvoyer les utilisateurs au frontend
    res.status(200).json(users); // Renvoyer la liste des utilisateurs avec un code 200
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs", error: error.message });
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

