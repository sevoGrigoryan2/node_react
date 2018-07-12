const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");

app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("Hello world");
});

const usersLogin = require("./routes/api/usersLogin");
const usersRegister = require("./routes/api/usersRegister");
const usersCurrent = require("./routes/api/usersCurrent");


const profils = require("./routes/api/profils");
const posts = require("./routes/api/posts");

app.use("/api/users/login",usersLogin);
app.use("/api/users/register",usersRegister);
app.use("/api/users/current",usersCurrent);


app.use("/api/profils",profils);

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
