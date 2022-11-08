const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    img: {
      type: String,
    //   required: [true, "Please Add Post"],
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    hashtag: String,
    friendTag: [],
    desc: {
      type: String,
      maxlength:200,
      required: false,
    },
    likes:{
        type:Array,
        deafult:[]
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted:{
        type: Boolean,
        default:false
    }                           // for Soft delete
  },
  {
    timestamps: true,
  }
);

PostSchema.pre('find', function() {
    this.where({ isDeleted: false });
  });
  
PostSchema.pre('findOne', function() {
    this.where({ isDeleted: false });
  });

module.exports = mongoose.model("Post", PostSchema, "posts");
