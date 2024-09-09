const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');

// Route pour l'inscription (POST /api/auth/register)
router.post('/register', registerUser);

// Route pour la connexion (POST /api/auth/login)
router.post('/login', loginUser);

// Route pour obtenir le profil de l'utilisateur connecté (GET /api/auth/profile)
router.get('/profile', getUserProfile);

module.exports = router;
