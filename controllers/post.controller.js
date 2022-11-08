const Post = require("../models/Post");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

//@desc     Uploading a post
//@route    POST /api/posts/upload_post
//@access   Private
exports.createPost = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  const post = await Post.create(req.body);

  if (!post) {
    return next(new ErrorResponse("Cannot upload post", 500));
  }

  res.status(201).json({
    sucess: true,
    data: post,
  });
});

//@desc     Like a post
//@route    PUT /api/posts/like_post/:id
//@access   Private
exports.likePost = asyncHandler(async (req, res, next) => {
   let post=await Post.findById(req.params.id)

    if(!post.likes.includes(req.user.id)){
        post.likes.push(req.user.id)
        await post.save()
    }
    else{
        return next(new ErrorResponse('You have already liked this post',400))
    }

    res.status(200).json({
        success:true,
        data:post
    }) 
});

//@desc     Delete a post(Soft Delete)
//@route    DELETE /api/posts/:id
//@access   Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post=await Post.findById(req.params.id)

    if(!post){
        return next(new ErrorResponse('post not found',400))
    }
    post.isDeleted=true
    await post.save()

    res.status(200).json({
        success:true,
        data:[]
    })
});
