// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.requireAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token du header

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Autorisation administrateur requise.' });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

exports.requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token du header Authorization

  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Ajouter userId à l'objet de requête pour l'utiliser dans les contrôleurs
    req.role = decoded.role; // Ajouter le rôle de l'utilisateur
    req.domain = decoded.domain; // Ajouter le domaine de l'utilisateur
    next(); // Poursuivre la requête
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
