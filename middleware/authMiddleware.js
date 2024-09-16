// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken'); // Ajoute cette ligne si elle manque

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Récupérer le token du cookie

  if (!token) {
    console.log('Token cookie is missing');
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Utilisation correcte de `jwt.verify`
    req.user = decoded; // Attacher les informations utilisateur à l'objet de requête
    console.log('Utilisateur authentifié:', req.user);  // Ajouter un log ici
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};