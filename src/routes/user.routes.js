const express = require('express');
const { register, login, showProfile } = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');
// const checkRole = require('../utils/checkRole');


const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// view profile
router.get('/profile', verifyToken, showProfile);

module.exports = router;
