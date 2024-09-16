// controllers/bugController.js
const connectDB = require('../config/db');

// controllers/bugController.js
// controllers/bugController.js
exports.getAllBugs = async (req, res) => {
  try {
    const db = await connectDB();
    const bugsCollection = db.collection('DomainsWithBugs');

    // Récupérer tous les bugs de la collection
    const allBugs = await bugsCollection.find({}).toArray(); // Récupère tous les documents de la collection
    console.log("Tout les bugs: ", allBugs)
    // Combiner tous les bugs si chaque document a un champ `bugs`
    const bugs = allBugs.flatMap(doc => doc.bugs || []);

    console.log("Bugs récupérés:", bugs);  // Ajoute ce log pour voir les bugs récupérés

    res.status(200).json(bugs);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les bugs:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de tous les bugs.' });
  }
};

exports.getBugsByDomain = async (req, res) => {
  const domainName = req.params.domainName; // Récupère le domaine de l'utilisateur à partir de l'URL

  try {
    const db = await connectDB();
    const bugsCollection = db.collection('DomainsWithBugs');

    // Utiliser `find` pour récupérer tous les documents correspondants
    const domainBugs = await bugsCollection.find({ domainName }).toArray(); // Utilise `find` au lieu de `findOne`

    if (!domainBugs.length) { // Vérifier s'il n'y a pas de résultats
      return res.status(404).json({ message: 'Aucun bug trouvé pour ce domaine.' });
    }

    // Si tu veux récupérer uniquement le champ `bugs` de chaque document
    const bugs = domainBugs.flatMap(doc => doc.bugs); // Combine tous les `bugs` de chaque document en un seul tableau
    res.json(bugs);

  } catch (error) {
    console.error('Erreur lors de la récupération des bugs par domaine:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des bugs.' });
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

