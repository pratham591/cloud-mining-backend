const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// Register User
exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  // Check if user already exists
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', 
      [username, hashedPassword], 
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User created!' });
      }
    );
  });
};

// Login User
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, 'yourSecretKey', {
      expiresIn: '1h'
    });

    res.json({ token });
  });
};
