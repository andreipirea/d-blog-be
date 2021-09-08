const express = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const db = require('../util/database');

const carouselController = require('../controllers/carousel');


router.post("/addslide", isAuth, carouselController.addSlide);

router.get("/getslides", carouselController.getSlides);

// router.get("/getpost/:id", carouselController.getPost);

router.put("/updateslide/:id", isAuth, carouselController.updateSlide);

router.delete("/deleteslide/:id", isAuth, carouselController.deleteSlide);

module.exports = router;