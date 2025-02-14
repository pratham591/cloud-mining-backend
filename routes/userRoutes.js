const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// This route handles POST requests to /api/users/register
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
