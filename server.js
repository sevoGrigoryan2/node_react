const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
app.use(express.static(__dirname + '/public'));
const cors = require("cors");

//app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
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
const profileByHandle = require("./routes/api/profileByHandle");
const profileByUserId = require("./routes/api/profileByUserId");
const allProfiles = require("./routes/api/allProfiles");
const profileAddEducation = require("./routes/api/profileAddEducation");
const profileAddExperience = require("./routes/api/profileAddExperience");
const deleteEducationById = require("./routes/api/deleteEducationById");
const deleteExperienceById = require("./routes/api/deleteExperienceById");


const posts = require("./routes/api/posts");

app.use("/api/users/login",usersLogin);
app.use("/api/users/register",usersRegister);
app.use("/api/users/current",usersCurrent);


app.use("/api/profile",profile);
app.use("/api/profile/handle/:handle",profileByHandle);
app.use("/api/profile/all",allProfiles);
app.use("/api/profile/user/:user_id",profileByUserId);
app.use("/api/profile/experience",profileAddExperience);
app.use("/api/profile/education",profileAddEducation);
app.use("/api/profile/education/:edu_id",deleteEducationById);
app.use("/api/profile/experience/:exp_id",deleteExperienceById);



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
