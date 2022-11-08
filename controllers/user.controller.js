const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//@desc     Get all users
//@route    GET /api/users
//@access   Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Register a User
//@route    POST /api/users
//@access   Public
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  // Create token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    sucess: true,
    data: user,
    token,
  });
});

//@desc     Login User
//@route    GET /api/users/login
//@access   Public
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // Validate Username and Password
  if (!username || !password) {
    return next(new ErrorResponse("Please Provide a email and password", 400));
  }

  // Check for User
  // Beacuse we have select false in model of user

  const user = await User.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  // Check if passwords matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

//@desc     Follow a User
//@route    PUT /api/users/follow/:id
//@access   Private
exports.followUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  user.followings.push(req.params.id);

  await user.save();

  user = await User.findById(req.params.id);
  user.followers.push(req.user.id);

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     UnFollow a User
//@route    PUT /api/users/unfollow/:id
//@access   Private
exports.unfollowUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  let index = user.followings.indexOf(req.params.id);
  if (index > -1) {
    user.followings.splice(index, 1);
  } else {
    return next(new ErrorResponse("User Not Found", 400));
  }

  await user.save();

  user = await User.findById(req.params.id);
  index = user.followers.indexOf(req.user.id);
  if (index > -1) {
    user.followers.splice(index, 1);
  } else {
    return next(new ErrorResponse("User Not Found", 400));
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     Block a User
//@route    PUT /api/users/block/:id
//@access   Private
exports.blockUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  user.blocked_user.push(req.params.id);

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc     Unblock a User
//@route    PUT /api/users/unblock/:id
//@access   Private
exports.unblockUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id);
  let index = user.blocked_user.indexOf(req.params.id);
  if (index > -1) {
    user.blocked_user.splice(index, 1);
  } else {
    return next(new ErrorResponse("User Not Found", 400));
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// Get Token from model,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
  });
};
