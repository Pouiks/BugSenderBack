// models/bugModel.js

const { ObjectId } = require('mongodb');

// Fonction pour récupérer tous les bugs
async function getAllBugs(db) {
  try {
    const bugsCollection = db.collection('DomainsWithBugs');
    const bugs = await bugsCollection.find().toArray();
    return bugs;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des bugs : ' + error.message);
  }
}

module.exports = { getAllBugs };
