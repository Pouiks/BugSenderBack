const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');

exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    const user = await usersCollection.insertOne({ email, passwordHash: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Error during registration', error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    const user = await usersCollection.findOne({ email });

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const db = await connectDB();
    const usersCollection = db.collection('Users');
    const user = await usersCollection.findOne({ _id: req.userId });
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};
