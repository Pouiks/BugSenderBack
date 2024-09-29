// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  let token = req.cookies.token; // Essayer de récupérer le token depuis les cookies
  if (!token && req.headers.authorization) {
    // Essayer de récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]; // Extraire le token après "Bearer"
    }
  }

  if (!token) {
    console.log('Token manquant');
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    console.log('Utilisateur authentifié :', req.user);
    next(); // Important d'appeler next() ici pour poursuivre
  } catch (error) {
    console.log('Échec de la vérification du token :', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
