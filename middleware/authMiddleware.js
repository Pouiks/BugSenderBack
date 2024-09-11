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

// exports.requireAuth = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Récupérer le token du header Authorization

//   if (!token) {
//     return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId; // Ajouter userId à l'objet de requête pour l'utiliser dans les contrôleurs
//     req.role = decoded.role; // Ajouter le rôle de l'utilisateur
//     req.domain = decoded.domain; // Ajouter le domaine de l'utilisateur
//     next(); // Poursuivre la requête
//   } catch (error) {
//     return res.status(401).json({ message: 'Token invalide ou expiré' });
//   }
// };
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log('Authorization header is missing');
    return res.status(401).json({ message: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_TOKEN, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    console.log('Token verified successfully, user:', user);
    req.user = user;  // Attach user information to the request object
    next();
  });
};

exports.isAdmin = async (req, res, next) => {
  try {
    const db = await connectDB();
    const userCollection = db.collection('Users');

    // Recherche de l'utilisateur par ID
    const user = await userCollection.findOne({ _id: req.user.userId });

    if (user && user.role === 'admin') {
      next(); // Si l'utilisateur est admin, continuer
    } else {
      return res.status(403).json({ message: 'Accès refusé. Vous n\'êtes pas administrateur.' });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du rôle admin:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la vérification du rôle admin.' });
  }
};