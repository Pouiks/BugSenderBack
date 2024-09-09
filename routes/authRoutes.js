// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// Exemple de données d'utilisateur pour la démonstration
const mockUser = {
  username: 'AdminUser',
  role: 'admin',
  email: 'admin@example.com'
};

// Exemple de route de connexion
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Logique de vérification d'authentification à implémenter
  if (email === mockUser.email && password === 'password123') {
    res.status(200).json({ user: mockUser });
  } else {
    res.status(401).json({ message: 'Identifiants incorrects' });
  }
});

module.exports = router;
