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

/**
 * Fonction pour vérifier si un dossier existe déjà dans Google Drive
 * @param {string} folderName - Nom du dossier à vérifier
 * @returns {Promise<string|null>} - ID du dossier s'il existe, sinon null
 */
async function checkIfFolderExists(folderName) {
  try {
    const response = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files.length > 0) {
      const folderId = response.data.files[0].id;
      console.log(`Dossier déjà existant : ${folderName}, ID: ${folderId}`);
      return folderId;
    } else {
      console.log(`Aucun dossier trouvé pour : ${folderName}`);
      return null;
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du dossier :', error);
    throw error;
  }
}

/**
 * Fonction pour créer un dossier Google Drive
 * @param {string} folderName - Nom du dossier à créer
 * @returns {Promise<string>} - ID du dossier créé
 */
async function createDriveFolder(folderName) {
  try {
    // Vérifier si le dossier existe déjà
    let folderId = await checkIfFolderExists(folderName);

    if (!folderId) {
      const response = await drive.files.create({
        resource: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        },
        fields: 'id',
      });

      folderId = response.data.id;
      console.log(`Dossier créé avec succès : ${folderId}`);

      // Partager le dossier avec le compte admin principal
      await shareDriveFolder(folderId, 'bugcollectorext@gmail.com');
    }

    return folderId;
  } catch (error) {
    console.error('Erreur lors de la création du dossier :', error);
    throw error;
  }
}

/**
 * Fonction pour partager le dossier avec le compte administrateur
 * @param {string} folderId - ID du dossier à partager
 * @param {string} email - Email du compte à qui partager le dossier
 */
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

module.exports = { createDriveFolder, checkIfFolderExists };
