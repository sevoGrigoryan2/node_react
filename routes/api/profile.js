const express = require('express');
const router = express.Router();
const passport = require('passport');
const validateProfileInput = require('../../validation/profile')

// Load User model
const User = require('../../models/users');

//Load Profile model
const Profile = require('../../models/profile');


// @route   GET api/profile
// @desc    Return current user's profile
// @access  Private
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
     Profile.findOne({user:req.user.id})
            .then(profile => {
                if(!profile){
                    errors.noprofile = "There is not a profile for user ";
                    return res.status(404).json(errors);
                }
                res.json(profile)
            })
            .catch(error=>console.log(error))
    }
  );

// @route   POST api/profile
// @desc    Create user's profile
// @access  Public
router.post('/', passport.authenticate('jwt', { session: false }),(req, res) => {
     const { errors, isValid } = validateProfileInput(req.body); 
     if(!isValid){
         return res.status(400).json(errors);
     }
     const profileFields = {};
     profileFields.user = req.user.id

     //get inputs value for create or update profile
    if(req.body.handle) profileFields.handle = req.body.handle
    if(req.body.company) profileFields.company = req.body.company
    if(req.body.website) profileFields.website = req.body.website
    if(req.body.location) profileFields.location = req.body.location
    if(req.body.bio) profileFields.bio = req.body.bio
    if(req.body.status) profileFields.status = req.body.status
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername

    //skills -Split into Arrays

    if(typeof req.body.skills !== undefined)
    {
        profileFields.skills = req.body.skills.split(',');
    }
    //social
    profile.social = {}
    if(req.body.youtube) profile.social.youtube = req.body.youtube
    if(req.body.facebook) profile.social.facebook = req.body.facebook    
    if(req.body.twitter) profile.social.twitter = req.body.twitter    
    if(req.body.linkedin) profile.social.linkedin = req.body.linkedin    
    if(req.body.instagram) profile.social.instagram = req.body.instagram    

    Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(profile){
                    Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true})
                    .then(profile=>res.json(profile))
                    .catch(error=>console.log(error))
                }else{
                    Profile.findOne({handle:profileFields.handle})
                           .then(profile=>{
                        if(profile){
                            errors.handle = "That handle already exist";
                            res.status(400).json(errors);
                        }
                        new Profile(profileFields).save()
                                                  .then(profile=>res.json(profile))
                                                  .catch(error=>console.log(error))
                    })
                }
            })            
}
  );



  module.exports = router;
