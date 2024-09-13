// routes/bugRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware'); // Assurez-vous que ce middleware existe
const { getBugsByDomain, getAllBugs, createBug } = require('../controllers/bugController');

// Route pour récupérer les bugs par domaine
router.get('/domain/:domainName', verifyToken, getBugsByDomain); // Vérifiez que la route est correcte

// Route pour récupérer tous les bugs (accessible uniquement aux administrateurs)
router.get('/', verifyToken, getAllBugs);

// Route pour créer un nouveau bug (accessible uniquement aux administrateurs)
// router.post('/', verifyToken, createBug);
router.post('/',  createBug);

module.exports = router;
