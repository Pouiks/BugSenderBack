// middlewares/roleMiddleware.js

const jwt = require('jsonwebtoken');

// Middleware pour vérifier si l'utilisateur est admin
exports.checkAdmin = (req, res, next) => {
  console.log("req.user: ",req.user);
  console.log("req.user.role: ",req.user.user);

  if (req.user && req.user.role === 'admin') {
    next(); // Autoriser l'accès si l'utilisateur est admin
  } else {
    res.status(403).json({ message: "Accès refusé : droits d'administrateur requis." });
  }
};
