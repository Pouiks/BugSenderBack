// routes/userRoutes.js
const express = require('express');
const { getAllUsers, createUser, updateUser } = require('../controllers/userController');
const router = express.Router();

router.get('/', getAllUsers);  // Obtenir tous les utilisateurs
router.post('/', createUser);  // Créer un nouvel utilisateur
router.put('/:id', updateUser);  // Mettre à jour un utilisateur existant

module.exports = router;
