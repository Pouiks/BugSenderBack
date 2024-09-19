const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'client', 'admin'],
    default: 'user',
  },
  googleDriveFolderId: {
    type: String, // Ce champ stockera l'ID du dossier Google Drive
    default: null, // Par défaut, pas de dossier tant qu'il n'est pas créé
  },
  license: {
    licenseKey: String,
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'expired'],
      default: 'active',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
