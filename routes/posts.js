const express = require("express");
const router = express.Router();
const {
  createPost,
  likePost,
  deletePost,
} = require("../controllers/post.controller");

const { protect } = require("../middleware/auth");

const User = require("../models/User");

router.route("/create_post").post(protect, createPost);

router.route("/like_post/:id").put(protect, likePost);

router.route("/:id").delete(protect, deletePost);

module.exports = router;
