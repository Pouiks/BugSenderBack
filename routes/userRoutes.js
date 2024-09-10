// routes/userRoutes.js
const express = require('express');
const { getAllUsers, createUser, updateUser, getUserProfile, updateOwnProfile } = require('../controllers/userController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { checkAdmin } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Voir et mettre à jour son propre profil
router.get('/profile', requireAuth, getUserProfile); // Voir son propre profil
router.put('/profile', requireAuth, updateOwnProfile); // Mettre à jour son propre profil

// Administrateur
router.get('/', requireAuth, checkAdmin, getAllUsers);
router.post('/', requireAuth, checkAdmin, createUser);
router.put('/:id', requireAuth, checkAdmin, updateUser);

module.exports = router;
