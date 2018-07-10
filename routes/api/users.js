const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const gravatar = require("gravatar");
router.get("/", (req, res) => res.json({ msg: "Users Works" }));

router.post('/regiter', (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                res.status(400).json({ msg: "Email Already exist" })
            } else {

                const avatar = gravatar.url(req.body.url, {
                    s: "200",//size
                    r: "pg",//rating
                    d: "mm"//default
                });


                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })
            }
        })
})

module.exports = router;