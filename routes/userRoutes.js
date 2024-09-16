// routes/userRoutes.js
const express = require('express');
const {
  getAllUsers,
  createUser,
  updateUser,
  getUserProfile, // Ajout correct de l'import
} = require('../controllers/userController'); // Correctement importé à partir du fichier userController
const { verifyToken } = require('../middleware/authMiddleware');
const { checkAdmin} = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/all', verifyToken, checkAdmin, getAllUsers);
router.post('/create', verifyToken, checkAdmin, createUser);
router.put('/update/:id', verifyToken, checkAdmin, updateUser);
router.get('/profile', verifyToken, getUserProfile); // Route pour obtenir le profil utilisateur

module.exports = router;
