const connectDB = require('../config/db');
const Bug = require('../models/bug');
const { handleScreenshotUpload } = require('../googleDriveService');

exports.getAllBugs = async (req, res) => {
  try {
    const db = await connectDB();
    const bugsCollection = db.collection('DomainsWithBugs');
    const allBugs = await bugsCollection.find({}).toArray();
    const bugs = allBugs.flatMap(doc => doc.bugs || []);
    res.status(200).json(bugs);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les bugs:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de tous les bugs.' });
  }
};

exports.getBugsByDomain = async (req, res) => {
  const domainName = req.params.domainName;
  try {
    const db = await connectDB();
    const bugsCollection = db.collection('DomainsWithBugs');
    const domainBugs = (await bugsCollection.find({ domainName }).toArray()).reverse();
    if (!domainBugs.length) {
      return res.status(404).json({ message: 'Aucun bug trouvé pour ce domaine.' });
    }
    const bugs = domainBugs.flatMap(doc => doc.bugs);
    res.json(bugs.reverse());
  } catch (error) {
    console.error('Erreur lors de la récupération des bugs par domaine:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des bugs.' });
  }
};

exports.createBug = async (req, res) => {
  try {
    const { domainName, createdBy, createdAt, bugs, screenshot } = req.body;
    const db = await connectDB();
    const bugsCollection = db.collection('DomainsWithBugs');

    let domainFolderId;
    const existingDomain = await bugsCollection.findOne({ domainName });

    if (!existingDomain || !existingDomain.googleDriveFolderId) {
      domainFolderId = await handleScreenshotUpload(domainName, null);
      if (existingDomain) {
        await bugsCollection.updateOne(
          { domainName },
          { $set: { googleDriveFolderId: domainFolderId } }
        );
      } else {
        await bugsCollection.insertOne({
          domainName,
          googleDriveFolderId: domainFolderId,
          bugs: [],
        });
      }
    } else {
      domainFolderId = existingDomain.googleDriveFolderId;
    }

    let screenshotUrl = null;
    if (screenshot) {
      screenshotUrl = await handleScreenshotUpload(domainName, screenshot);
    }

    const bugData = {
      ...bugs[0],
      screenshotUrl,
      date: new Date().toISOString(),
      reportedBy: createdBy,
    };

    const updateResult = await bugsCollection.updateOne(
      { domainName },
      { $push: { bugs: bugData } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour des bugs.' });
    }

    res.status(201).json({ message: 'Bug créé avec succès', bugData });

  } catch (error) {
    console.error('Erreur lors de la création du bug:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la création du bug' });
  }
};