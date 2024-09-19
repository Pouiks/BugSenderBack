const { google } = require('googleapis');
const path = require('path');

// Charger la clé privée depuis le fichier JSON téléchargé
const KEYFILEPATH = path.join(__dirname, 'bugcollectorext-4d06c4924202.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

// Initialiser l'authentification
const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

// Fonction pour créer un dossier Google Drive
async function createDriveFolder(folderName) {
  try {
    const response = await drive.files.create({
      resource: {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      },
      fields: 'id',
    });

    const folderId = response.data.id;
    console.log(`Dossier créé avec succès : ${folderId}`);

    // Partager le dossier avec le compte admin principal
    await shareDriveFolder(folderId, 'bugcollectorext@gmail.com');
    return folderId;
  } catch (error) {
    console.error('Erreur lors de la création du dossier:', error);
    throw error;
  }
}

// Fonction pour partager le dossier avec le compte administrateur
async function shareDriveFolder(folderId, email) {
  try {
    await drive.permissions.create({
      resource: {
        role: 'writer', // Rôle du compte partagé (writer, reader, etc.)
        type: 'user',
        emailAddress: email,
      },
      fileId: folderId,
      fields: 'id',
    });
    console.log(`Dossier partagé avec ${email}`);
  } catch (error) {
    console.error('Erreur lors du partage du dossier :', error);
  }
}

module.exports = { createDriveFolder };
