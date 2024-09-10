// routes/authRoutes.js
const express = require('express');
const { registerUser, login, getUserProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware'); // Importer le middleware de vérification de token

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/profile', verifyToken, getUserProfile); // Utiliser 'verifyToken' pour vérifier l'authentification

module.exports = router;
