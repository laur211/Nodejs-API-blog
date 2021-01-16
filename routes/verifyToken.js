const jwt = require ("jsonwebtoken");
 
module.exports = function auth (req, res, next){
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Access denied");
    try {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(verify);
        console.log(req.user);
        req.user = verify;
        next();
    }catch(err){
        res.status(400).send("Invalid token");
    }
}