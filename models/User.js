const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Add a Name"],
    },
    email: {
      type: String,
      required: [true, "Please Add a Email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    username: {
      type: String,
      required: [true, "Please Add a Username"],
      unique: true,
    },
    profile: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    password: {
      type: String,
      required: [true, "Please Add a Password"],
      minlength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Please add a valid Password",
      ],
      select: false,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "others"],
      required: [true, "Please Select Gender"],
    },
    mobile: {
      type: String,
      required: [true, "Please add a Mobile Number"],
      minlength: 8,
      match: [
        /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/,
        "Please add a valid Mobile Number",
      ],
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    blocked_user: {
      type: Array,
      default:[],
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and Return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user entered password to hashed pssword in Database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema, "users");
