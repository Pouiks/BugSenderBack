const express = require('express');
const { getAllBugs, createBug } = require('../controllers/bugController');
const router = express.Router();

router.get('/', getAllBugs);  // Route pour obtenir tous les bugs
router.post('/', createBug);  // Route pour créer un nouveau bug

module.exports = router;
