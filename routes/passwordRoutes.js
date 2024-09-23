const express = require('express');
const bcrypt = require('bcrypt');
const { connectDB } = require('../config/db');
const { ObjectId } = require('mongodb');  // Utilisation de MongoDB natif
const { updatePassword } = require('../controllers/userController');


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
router.post('/setup-password/:token', updatePassword);


module.exports = router;
