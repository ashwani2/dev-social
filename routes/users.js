const express = require("express");
const router = express.Router();
const {
  getUsers,
  registerUser,
  loginUser,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser
} = require("../controllers/user.controller");

const advancedResults = require("../middleware/advancedResults");
const { protect } = require("../middleware/auth");

const User = require("../models/User");

router.route("/").get(advancedResults(User), getUsers).post(registerUser);

router.route("/login").get(loginUser);

router.route("/follow/:id").put(protect,followUser);

router.route("/unfollow/:id").put(protect,unfollowUser);

router.route("/block/:id").put(protect,blockUser);

router.route("/unblock/:id").put(protect,unblockUser);

module.exports = router;
