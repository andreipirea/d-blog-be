const express = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const aboutPageController = require('../controllers/about');


router.get("/getaboutpage", aboutPageController.getAboutPage);

router.post("/addaboutpage", isAuth, aboutPageController.addAboutPage);

router.put("/updateaboutpage/:id", isAuth, aboutPageController.updateAboutPage);

module.exports = router;
