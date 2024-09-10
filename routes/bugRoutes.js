// routes/bugRoutes.js
const express = require('express');
const { getAllBugs, createBug } = require('../controllers/bugController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { checkAdmin } = require('../middlewares/roleMiddleware');
const router = express.Router();

// Administrateurs : voir tous les bugs
router.get('/admin', requireAuth, checkAdmin, getAllBugs); // Route pour voir tous les bugs (admin)

// Clients : voir uniquement les bugs de leur domaine
router.get('/', requireAuth, (req, res) => {
  const { domain } = req;
  getAllBugs(req, res, domain); // Filtrer par domaine pour les clients
});

router.post('/', requireAuth, createBug); // Créer un bug, accessible à tous les utilisateurs connectés

module.exports = router;
