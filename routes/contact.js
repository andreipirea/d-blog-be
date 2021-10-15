const express = require('express');

const router = express.Router();

const contactController = require("../controllers/contact");

router.post('/contact', contactController.getContact);

module.exports = router;