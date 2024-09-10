// routes/authRoutes.js
const express = require('express');
const { registerUser, login, getUserProfile } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/authMiddleware'); // Importer le middleware requireAuth
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', login);
router.get('/profile', requireAuth, getUserProfile); // Utiliser requireAuth pour vérifier l'authentification

module.exports = router;
