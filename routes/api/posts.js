const express = require('express');
const router = express.Router();
const passport = require('passport');

//load Post's Model
const Post = require("../../models/post");

//load Profile's Model
const Profile = require("../../models/profile");

const validatePostFields = require('../../validation/post');
// @route   GET api/post
// @desc    Get ALl Post
// @access  Public

router.get("/", (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(error => res.status(400).json({ noposts: "There are not posts" }))
})
// @route   GET api/post
// @desc    Get Single Post
// @access  Public

router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .sort({ date: -1 })
        .then(post => res.json(post))
        .catch(error => res.status(400).json({ nopostfound: "No Post Found" }))
})

// @route   Delete api/post/:id
// @desc    Delete Post
// @access  Private

router.delete("/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.user.toString() !== req.user.id) {
                        res.status(401).json({ unautorized: "User not autorized" })
                    }

                    //delete
                    post.remove().then(() => res.json({ success: true }))
                })
                .catch(error => res.status(404).json({ postnofound: "No post found" }))
        })
})


// @route   Post api/post/like/:id
// @desc    Add Like
// @access  Private

router.post("/like/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(like => like.user.toString() === req.user.id).length > 0
                    ) {
                        res.status(400).json({ alreadyliked: "User Already liked this post" })
                    }
                    post.likes.unshift({user:req.user.id});
                    post.save().then(post => { res.json(post) })
                })
                .catch(error => res.status(404).json({ postnofound: "No post found" }))
        })
})


// @route   Post api/post/unlike/:id
// @desc    Unlike Post
// @access  Private

router.post("/unlike/:id", passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(like => like.user.toString() === req.user.id).length === 0
                    ) {
                        res.status(400).json({ notliked: "User yet liked this post" })
                    }
                    
                    const removeIndex = post.likes
                        .map(item=>item.user.toString())
                        .indexOf(req.user.id);

                        post.likes.splice(removeIndex,1);

                        post.save().then(post=res.json(post))

                })
                .catch(error => res.status(404).json({ postnofound: "No post found" }))
        })
})

// @route   Post api/post
// @desc    Create a new post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostFields(req.body);
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save()
        .then(post => res.json(post))
        .catch(error => console.log(error))
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
    '/comment/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      const { errors, isValid } = validatePostFields(req.body);
  
      // Check Validation
      if (!isValid) {
        // If any errors, send 400 with errors object
        return res.status(400).json(errors);
      }
  
      Post.findById(req.params.id)
        .then(post => {
          const newComment = {
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            user: req.user.id
          };
  
          // Add to comments array
          post.comments.unshift(newComment);
  
          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    }
  );
  
  // @route   DELETE api/posts/comment/:id/:comment_id
  // @desc    Remove comment from post
  // @access  Private
  router.delete(
    '/comment/:id/:comment_id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
      Post.findById(req.params.id)
        .then(post => {
          // Check to see if comment exists
          if (
            post.comments.filter(
              comment => comment._id.toString() === req.params.comment_id
            ).length === 0
          ) {
            return res
              .status(404)
              .json({ commentnotexists: 'Comment does not exist' });
          }
  
          // Get remove index
          const removeIndex = post.comments
            .map(item => item._id.toString())
            .indexOf(req.params.comment_id);
  
          // Splice comment out of array
          post.comments.splice(removeIndex, 1);
  
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    }
  );
  

module.exports = router;
