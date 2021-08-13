const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.put('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/user', authController.getUser);

module.exports = router;