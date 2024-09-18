// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken'); // Ajoute cette ligne si elle manque

exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log('Token manquant');
    return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded;
    console.log('Utilisateur authentifié :', req.user);
    next(); // Important d'appeler next() ici pour poursuivre le middleware suivant
  } catch (error) {
    console.log('Échec de la vérification du token :', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};


