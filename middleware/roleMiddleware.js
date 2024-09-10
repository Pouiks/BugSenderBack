// middlewares/roleMiddleware.js
exports.checkAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé : droits d'administrateur requis" });
    }
    next();
  };
  