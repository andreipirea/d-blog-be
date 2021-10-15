const express = require('express');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const postsController = require('../controllers/posts');

router.get('/', postsController.getPosts)

router.post("/addpost", isAuth, postsController.addPost);

router.get("/getposts", postsController.getPosts);

// router.get("/getpost/:id", postsController.getPost);

router.put("/updatepost/:id", isAuth, postsController.updatePost);

router.delete("/deletepost/:id", isAuth, postsController.deletePost);

module.exports = router;