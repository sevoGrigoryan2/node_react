const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const passport = require('passport');


// Load User model
const Profile = require('../../models/profile');

// @route   GET api/profile/handle/:handle
// @desc    Get Profile By Handle
// @access  Public

router.get('/',(req, res) => {
     Profile.findOne({handle:req.params.handle})
            .then(profile =>{
              if(profile){
                res.json(profile)
              }else{

              }
            })

    }
  );

  module.exports = router;
