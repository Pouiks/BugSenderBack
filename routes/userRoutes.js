// routes/userRoutes.js
const express = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  getUserProfile, // Ajout correct de l'import
} = require('../controllers/userController'); // Correctement importé à partir du fichier userController
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all', verifyToken, isAdmin, getAllUsers);
router.post('/create', verifyToken, isAdmin, createUser);
router.put('/update/:id', verifyToken, isAdmin, updateUser);
router.get('/profile', verifyToken, getUserProfile); // Route pour obtenir le profil utilisateur

module.exports = router;
