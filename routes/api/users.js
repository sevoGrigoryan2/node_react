const express = require("express");
const router = express.Router();
const User = require("../../models/users");
const gravatar = require("gravatar");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../../config/keys").secretOrKey;

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

router.post('/register', (req, res) => {
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
                });

                bcryptjs.genSalt(10, (err, salt) => {
                    bcryptjs.hash(newUser.password, salt, (err, hash) => {
                        if (err);
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "User not found" })
            } else {
                bcryptjs.compare(password, user.password)
                    .then(isMatch => {
                        if (isMatch) {
                            const payload = { id: user.id, name: user.name, avatar: user.avatar }
                            jwt.sign(
                                payload,
                                secret,
                                { expiresIn: 3600 },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: 'Bearer ' + token
                                    })
                                }

                            )
                        } else {
                            return res.status(400).json({ password: "Password Incorrect" })
                        }
                    })
            }
        })

})

module.exports = router;