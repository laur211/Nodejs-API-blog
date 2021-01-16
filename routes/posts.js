const router = require("express").Router();
const verify = require("./verifyToken");
const postSchema = require("../modules/schemas");
const mongoose = require("mongoose");

router.get("/", async (req, res) =>{
    const posts = await postSchema.find();
    res.json(posts);

})

router.post("/", async(req, res) =>{
    const post = new postSchema({
        title: req.body.title,
        description: req.body.description
    });
    try{
        const savedPost = await post.save();
        res.status(201).send("Post created");
    }catch(err){
        res.json({message: err});
    }
})


module.exports = router;