const { ObjectId } = require('mongodb');

const User = {
  collectionName: 'Users',
  schema: {
    _id: ObjectId,
    email: String,
    passwordHash: String,
    role: String,
    createdAt: Date,
    updatedAt: Date,
    domains: [
      {
        domainName: String,
        license: {
          licenseKey: String,
          startDate: Date,
          endDate: Date,
          status: String,
        },
      },
    ],
  },
};

module.exports = User;
