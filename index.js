const express = require ("express");
const app =  express();
const mongoose = require("mongoose");
const dontenv = require("dotenv");
const authRoute = require ("./routes/auth");
const postRoute = require("./routes/posts");



dontenv.config();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true,
useUnifiedTopology: true }, (err)=>{
    if (err){
        console.log("There are some errors: " + err);
    }else{
        console.log("Connected to mongoDB");
}
});

app.use(express.json());

app.use("/api/user", authRoute);

app.use("/api/posts", postRoute);

app.listen(3000, ()=>
console.log("Server started"));