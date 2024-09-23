const { ObjectId } = require('mongodb');

const bugSchema = {
  domainName: {
    type: 'string',
    required: true,
  },
  caseNumber: {
    type: 'string',
    required: true,
  },
  screenshotUrl: {
    type: 'string',  // URL du screenshot dans Google Drive
    default: null,
  },
  bugs: [
    {
      url: {
        type: 'string',
        required: true,
      },
      description: {
        type: 'string',
        required: true,
      },
      impact: {
        type: 'string',
        enum: ['Peu gênant', 'Perturbant', 'Grave'],
        required: true,
      },
      date: {
        type: 'date',
        default: new Date(),
      },
      reportedBy: {
        type: 'string',
        required: true,
      },
    },
  ],
  createdAt: {
    type: 'date',
    default: new Date(),
  },
};

// Fonction pour insérer un bug dans MongoDB
async function insertBug(db, bugData) {
  try {
    const bugsCollection = db.collection('Bugs');
    const result = await bugsCollection.insertOne(bugData);
    return result;
  } catch (error) {
    throw new Error('Erreur lors de l\'insertion du bug en base de données : ' + error.message);
  }
}

// Fonction pour récupérer les bugs par domaine
async function findBugsByDomain(db, domainName) {
  try {
    const bugsCollection = db.collection('DomainsWithBugs');
    const domainBugs = await bugsCollection.find({ domainName }).toArray();
    return domainBugs;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des bugs : ' + error.message);
  }
}

// Fonction pour supprimer un bug par son ID
async function deleteBugById(db, domainName, bugId) {
  try {
    const bugsCollection = db.collection('DomainsWithBugs');
    const result = await bugsCollection.updateOne(
      { domainName },
      { $pull: { bugs: { _id: ObjectId(bugId) } } }
    );
    return result;
  } catch (error) {
    throw new Error('Erreur lors de la suppression du bug : ' + error.message);
  }
}

module.exports = { bugSchema, insertBug, findBugsByDomain, deleteBugById };
