const router = require ("express").Router();
const User = require ("../modules/schemas");
const {registerValidation, loginValidation} = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken");




router.post("/register", async (req,res)=>{
    const validationRegister = registerValidation(req.body)
    if(validationRegister.error){
        return res.status(400).json({message: validationRegister.error.details[0].message})};
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists){
        return res.status(400).send("Email already exists")
    };
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User ({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const userSaved = await user.save();
        // res.json(userSaved);
        const token = jwt.sign({_id:user._id}, process.env.SECRET_TOKEN);
        res.header("auth-token", token).send(token);
    }catch(err){
        res.json({message: err})
    }
});





router.post("/login", async(req, res)=>{
    const validationLogin = loginValidation(req.body)
    if(validationLogin.error){
        return res.status(400).json({message: validationRegister.error.details[0].message})};

    const user = await User.findOne({name: req.body.name});
    if (!user){
        return res.status(400).send("User don't exist");
    };
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass){
        return res.status(400).send("Invalid password");
    };

    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
    res.header("auth-token", token).send(token);

});


module.exports = router;