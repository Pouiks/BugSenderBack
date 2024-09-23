const express = require('express');
const bcrypt = require('bcrypt');
const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');  // Utilisation de MongoDB natif

const router = express.Router();

// Route pour vérifier le token et afficher la page de création de mot de passe
router.get('/setup-password/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    // Vérifier si le token est valide et n'a pas expiré
    const user = await usersCollection.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    // Afficher le formulaire de création de mot de passe (côté frontend)
    res.send('<form>...Formulaire pour entrer le mot de passe...</form>');
  } catch (error) {
    console.error('Erreur lors de la validation du token:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// Route pour définir le nouveau mot de passe
router.post('/setup-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');

    // Vérifier si le token est valide et n'a pas expiré
    const user = await usersCollection.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token invalide ou expiré.' });
    }

    // Hacher le mot de passe avec bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Mettre à jour l'utilisateur avec le nouveau mot de passe
    await usersCollection.updateOne(
      { _id: new ObjectId(user._id) },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpiry: "" }  // Supprimer le token et son expiration
      }
    );

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
