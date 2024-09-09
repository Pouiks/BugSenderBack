// controllers/bugController.js
const connectDB = require('../config/db');

exports.getAllBugs = async (req, res) => {
  console.log("Début de la fonction getAllBugs()");
  try {
    const db = await connectDB(); // Connexion à la base de données
    console.log("Connexion à la DB réussie.");
    const bugsCollection = db.collection('DomainsWithBugs'); // Accès à la collection 'DomainsWithBugs'
    console.log("Accès à la collection DomainsWithBugs.");
    
    // Utilisez toArray() pour convertir le curseur en tableau de documents
    const bugs = await bugsCollection.find().toArray(); 
    console.log("Bugs trouvés :", bugs);
    
    res.json(bugs);
  } catch (error) {
    console.error('Erreur lors de la récupération des bugs:', error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des bugs", error: error.message });
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
          license
      });

      res.status(201).json({ message: 'Bug créé avec succès', bugId: result.insertedId });
  } catch (error) {
      console.error('Erreur lors de la création du bug:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la création du bug' });
  }
};
