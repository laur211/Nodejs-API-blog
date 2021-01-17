const router = require("express").Router();
const verify = require("./verifyToken");
const postSchema = require("../modules/schemas");
const { query } = require("express");
const verifyToken = require("./verifyToken");


router.get("/", async (req, res) =>{
    const posts = await postSchema.find();
    res.json(posts);

});

router.get("/:postId", async (req, res) => {
    try{
        const post = await postSchema.findById(req.params.postId);
        res.json(post);
    }catch(err){
        res.status(404).send("Post not found");
    }
});




router.post("/", verifyToken, async(req, res) =>{
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
});

router.patch("/:postId",verifyToken, async (req, res) => {
    try{
        const updatePost = await postSchema.updateOne(
            {_id: req.params.postId},
            {$set: {
                title: req.body.title,
                description: req.body.description
            }})
            res.status(202).send("Post updated");
    }catch(err){
        res.json({message: err});
    }
});

router.delete("/:postId",verifyToken, async (req, res)=>{
    try{
        const postDeleted = await postSchema.findByIdAndDelete(req.params.postId);
        res.send("Post has been deleted!");        
    }catch(err){
        res.status(400).json({message: err})
    }
});


module.exports = router;