const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// @desc    Create a post
// @route   POST /api/post/
// @access  Private
router.post("/", async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }
});

// Get a post
// @desc    Get single post
// @route   POST /api/post/:id
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const singlePost = await Post.findById(req.params.id)
        res.status(200).json(singlePost);
    } catch (err) {
        res.status(500).json(err)
    }
});

// @desc    Get all posts by user
// @route   POST /api/post/:userID
// @access  Public
router.get("/:userID", async (req, res) => {
    try {
        const allPost = await Post.find(req.params.userID)
        res.status(200).json(allPost);
    } catch (err) {
        res.status(500).json(err)
    }
});

// @desc    Get all posts
// @route   POST /api/post/
// @access  Public
router.get("/", async (req, res) => {
    try {
        const allPost = await Post.find({})
        res.status(200).json(allPost);
    } catch (err) {
        res.status(500).json(err)
    }
});

// Update a post
// @desc    Create post
// @route   POST /api/post/
// @access  Private
router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (post.userID === req.body.userID) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("Post updated");
        } else {
            res.status(403).json("You can only update yours");
        }
    } catch (err) {
        res.status(500).json("Error", err);
    }
})

// Delete a post
// @desc    Create post
// @route   POST /api/post/
// @access  Private
router.delete("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (post.userID === req.body.userID) {
            await post.deleteOne();
            res.status(200).json("Post deleted");
        } else {
            res.status(403).json("You can only delete yours");
        }
    } catch (err) {
        res.status(500).json("Error", err);
    }
})

// Like a post
// @desc    Create post
// @route   POST /api/post/
// @access  Private
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userID)) {
            await post.updateOne({ $push: { likes: req.body.userID } });
            res.status(200).json("You liked this post")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userID } });
            res.status(200).json("You disliked this post")
        }
    } catch (err) {
        res.status(500).json(err);
    }
})


// Get timeline post
// @desc    Create post
// @route   POST /api/post/
// @access  Public
router.get("/timeline/all", async (req, res) => {
    try {
        const currUser = await User.findById(req.body.userID);
        const userPosts = await Post.find({ userID: currUser._id });

        const friendPosts = await Promise.all(
            currUser.followings.map((friendId) => {
                return Post.find({ userID: friendId });
            })
        );

        res.json(userPosts.concat(...friendPosts))
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;