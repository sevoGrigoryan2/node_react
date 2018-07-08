const express = require("express");
const app = express();

app.get('/',(req,res)=>{
    res.send("Hello world");
});

const users = require("./routes/api/users");
const profils = require("./routes/api/profils");
const posts = require("./routes/api/posts");

app.use("/api/users",users);
app.use("/api/profils",profils);
app.use("/api/posts",posts);

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
