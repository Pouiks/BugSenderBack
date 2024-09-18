// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken'); // Ajoute cette ligne si elle manque

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log('Token cookie is missing');
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    console.log('Utilisateur authentifié:', req.user);
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};