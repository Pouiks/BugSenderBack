// routes/authRoutes.js
const express = require('express');
const { registerUser, login, getUserProfile, logout } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/profile', verifyToken, getUserProfile);
router.post('/logout', logout); // Ajouter la route de déconnexion

module.exports = router;
