// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/userController');

router.post('/api/authenticate', login);

module.exports = router;
