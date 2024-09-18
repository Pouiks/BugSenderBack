// middlewares/roleMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware pour vérifier si l'utilisateur est admin
exports.checkAdmin = (req, res, next) => {
  console.log('checkAdmin appelé');
  console.log('Rôle utilisateur :', req.user.role); // Voir si le rôle est bien passé
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux administrateurs.' });
  }
  next();
};

