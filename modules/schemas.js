const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6
    },
    email: {
        type: String,
        required:true,
        max: 255,
        min: 6
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    }
});


const postsSchema = mongoose.Schema({
    title:{
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    description:{
        type: String,
        required: false,
        min: 6,
        max: 255
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports.userSchema = mongoose.model("User", userSchema);
module.exports.postsSchema = mongoose.model("Posts", postsSchema);
