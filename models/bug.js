const mongodb = require('mongodb');

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
    type: 'string', // URL du screenshot dans Google Drive
    default: null, // Facultatif si le screenshot n'est pas fourni
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

module.exports = { bugSchema, insertBug };
