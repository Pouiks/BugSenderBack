const { ObjectId } = require('mongodb');

const userSchema = {
  username: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
  },
  role: {
    type: 'string',
    enum: ['user', 'client', 'admin'],
    default: 'user',
  },
  googleDriveFolderId: {
    type: 'string',  // Ce champ stocke l'ID du dossier Google Drive
    default: null,
  },
  resetToken: {
    type: 'string',  // Token pour la réinitialisation de mot de passe
  },
  resetTokenExpiry: {
    type: 'date',  // Expiration du token de réinitialisation de mot de passe
  },
  password: {
    type: 'string',  // Mot de passe hashé
  },
  createdAt: {
    type: 'date',
    default: new Date(),
  },
};

// Fonction pour insérer un nouvel utilisateur dans MongoDB
async function insertUser(db, userData) {
  try {
    const usersCollection = db.collection('Users');
    const result = await usersCollection.insertOne(userData);
    return result;
  } catch (error) {
    throw new Error('Erreur lors de l\'insertion de l\'utilisateur en base de données : ' + error.message);
  }
}

// Fonction pour trouver un utilisateur par email
async function findUserByEmail(db, email) {
  try {
    const usersCollection = db.collection('Users');
    return await usersCollection.findOne({ email });
  } catch (error) {
    throw new Error('Erreur lors de la recherche de l\'utilisateur par email : ' + error.message);
  }
}

// Fonction pour mettre à jour un utilisateur par ID
async function updateUser(db, userId, updateData) {
  try {
    const usersCollection = db.collection('Users');
    return await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de l\'utilisateur : ' + error.message);
  }
}

module.exports = { userSchema, insertUser, findUserByEmail, updateUser };
