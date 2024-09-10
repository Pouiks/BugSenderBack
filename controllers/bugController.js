// controllers/bugController.js
const connectDB = require('../config/db');

// controllers/bugController.js
exports.getAllBugs = async (req, res, domainFilter = null) => {
  try {
    const db = await connectDB();
    const bugsCollection = db.collection('DomainsWithBugs');

    // Filtrer les bugs par domaine si un domaine est spécifié
    const query = domainFilter ? { domainName: domainFilter } : {};
    const bugs = await bugsCollection.find(query).toArray();
    
    res.json(bugs);
  } catch (error) {
    console.error('Erreur lors de la récupération des bugs:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des bugs' });
  }
};


exports.createBug = async (req, res) => {
  try {
      console.log("Données reçues pour la création de bug:", req.body);  // Ajoutez ceci pour déboguer

      const { domainName, createdBy, createdAt, bugs, license } = req.body;

      // Connexion à la base de données
      const db = await connectDB(); 
      const bugsCollection = db.collection('DomainsWithBugs');

      // Insertion du bug dans la collection
      const result = await bugsCollection.insertOne({
          domainName,
          createdBy,
          createdAt,
          bugs,
      });

      res.status(201).json({ message: 'Bug créé avec succès', bugId: result.insertedId });
  } catch (error) {
      console.error('Erreur lors de la création du bug:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la création du bug' });
  }
};
