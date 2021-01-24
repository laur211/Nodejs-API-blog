const router = require ("express").Router();
const User = require ("../modules/schemas").userSchema;
const {registerValidation, loginValidation} = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken");



router.post("/register", async (req,res)=>{
    console.log("Entered on register");
    const validationRegister = registerValidation(req.body)
    if(validationRegister.error){
        console.log(validationRegister.error.details[0].message);
        return res.status(400).json({message: validationRegister.error.details[0].message})};
    const emailExists = await User.findOne({email: req.body.email});
    const nameExists = await User.findOne({name: req.body.name});
    if (emailExists){
        console.log("Email exists");
        return res.status(400).json({message: "Email already exists"});
    };
    if(nameExists){
        console.log("name exists");
        return res.status(400).json({message: "Name is already taken"});
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
        const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET);
        res.status(201).header("auth-token", token).json({token: token});
    }catch(err){
        console.log(err);
        res.status(400).json({message: err})
    }
});





router.post("/login", async(req, res)=>{
    const validationLogin = loginValidation(req.body)
    if(validationLogin.error){
        console.log(validationLogin.error.details[0].message);
        // return res.status(400).send({message: validationLogin.error.details[0].message})};
        return res.status(400).json({message: validationLogin.error.details[0].message})};

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