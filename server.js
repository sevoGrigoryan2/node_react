const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

const usersLogin = require("./routes/api/usersLogin");
const usersRegister = require("./routes/api/usersRegister");
const usersCurrent = require("./routes/api/usersCurrent");


const profile = require("./routes/api/profile");
const profile = require("./routes/api/profileByHandle");

const posts = require("./routes/api/posts");

app.use("/api/users/login",usersLogin);
app.use("/api/users/register",usersRegister);
app.use("/api/users/current",usersCurrent);


app.use("/api/profile",profile);
app.use("/api/profile/handle/:handle",profileByHandle);


app.use("/api/posts",posts);
app.use(passport.initialize());

require("./config/passport")(passport); 

// DB config

const db = require("./config/keys").mongoUrl;

// connect to db

const mongoose = require("mongoose");

mongoose
        .connect(db)
        .then(()=>console.log("DB connected"))
        .catch(err=>console.log(err))

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>console.log(`Server running on ${PORT}`));
