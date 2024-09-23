const { google } = require('googleapis');
const path = require('path');
const { Readable } = require('stream'); // Importer Readable pour créer un stream

const KEYFILEPATH = path.join(__dirname, 'bugcollectorext-4d06c4924202.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const auth = new google.auth.GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Convertir un Buffer en Readable Stream pour l'upload
 */
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Fin du stream
  return stream;
}

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
      return response.data.files[0].id;
    } else {
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
        role: 'writer',
        type: 'user',
        emailAddress: email,
      },
      fileId: folderId,
      fields: 'id',
    });
  } catch (error) {
    console.error('Erreur lors du partage du dossier :', error);
  }
}

/**
 * Fonction pour uploader un fichier (screenshot) dans un dossier Google Drive
 * @param {string} base64Data - La donnée du fichier en base64
 * @param {string} folderId - L'ID du dossier dans lequel uploader le fichier
 * @returns {Promise<string>} - L'URL du fichier Google Drive
 */
async function uploadFileToDrive(base64Data, folderId) {
  try {
    // Convertir le base64 en buffer
    const buffer = Buffer.from(base64Data.split(",")[1], 'base64');

    // Convertir le buffer en stream pour l'upload
    const stream = bufferToStream(buffer);

    const response = await drive.files.create({
      resource: {
        name: `screenshot_${Date.now()}.png`, // Nommer le fichier avec un timestamp
        parents: [folderId], // Spécifier le dossier parent
      },
      media: {
        mimeType: 'image/png',
        body: stream, // Utiliser le stream pour l'upload
      },
      fields: 'id, webViewLink',
    });

    const fileId = response.data.id;

    // Rendre le fichier accessible à n'importe qui avec le lien
    await makeFilePublic(fileId);

    return response.data.webViewLink; // Retourner le lien pour la vue
  } catch (error) {
    console.error('Erreur lors de l\'upload du fichier:', error);
    throw error;
  }
}


/**
 * Fonction pour gérer l'upload du screenshot dans le dossier du domaine
 * @param {string} domainName - Le nom du domaine
 * @param {string} base64Screenshot - La donnée de la capture d'écran en base64
 * @returns {Promise<string|null>} - L'URL du screenshot ou null s'il n'y a pas de screenshot
 */
async function handleScreenshotUpload(domainName, base64Screenshot) {
  try {
    let folderId = await checkIfFolderExists(domainName);

    if (!folderId) {
      folderId = await createDriveFolder(domainName);
    }

    if (base64Screenshot) {
      const screenshotUrl = await uploadFileToDrive(base64Screenshot, folderId);
      return screenshotUrl;
    } else {
      console.log("Aucune capture d'écran fournie.");
      return null;
    }
  } catch (error) {
    console.error('Erreur dans le processus d\'upload du screenshot:', error);
    throw error;
  }
}
async function makeFilePublic(fileId) {
  try {
    await drive.permissions.create({
      resource: {
        role: 'reader',  // Permettre à tout le monde de lire le fichier
        type: 'anyone',  // Permettre à toute personne ayant le lien de voir le fichier
      },
      fileId: fileId,
      fields: 'id',
    });
    console.log(`Fichier avec l'ID ${fileId} est maintenant public.`);
  } catch (error) {
    console.error('Erreur lors de la modification des permissions du fichier :', error);
  }
}

const deleteScreenshotFromGoogleDrive = async (fileUrl) => {
  try {
    const fileId = fileUrl.match(/\/d\/(.*?)\//)[1];  // Extraire l'ID du fichier depuis l'URL Google Drive

    // Utiliser l'objet 'drive' déjà configuré avec l'authentification
    await drive.files.delete({
      fileId: fileId,
    });

    console.log(`Le fichier avec l'ID ${fileId} a été supprimé de Google Drive.`);
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier Google Drive :', error);
    throw new Error('Erreur lors de la suppression du fichier dans Google Drive');
  }
};

module.exports = { createDriveFolder, checkIfFolderExists, uploadFileToDrive, handleScreenshotUpload, makeFilePublic, deleteScreenshotFromGoogleDrive };
