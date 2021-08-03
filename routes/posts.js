const express = require('express');

const router = express.Router();

const db = require('../util/database');

const postsController = require('../controllers/posts');

router.get('/', postsController.getPosts)

router.post("/addpost", postsController.addPost);

router.get("/getposts", postsController.getPosts);

// router.get("/getpost/:id", postsController.getPost);

router.put("/updatepost/:id", postsController.updatePost);

router.delete("/deletepost/:id", postsController.deletePost);

module.exports = router;