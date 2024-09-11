const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if(!token) {
        return res.status(401).json({error: 'Access denied. No token provided.'});
    }

    try{
        const verified = jwt.verify(token, 'Your_jwt_secret');
        req.user = verified;
        next();
    }catch(err){
        res.status(400).json({error:'Invalid token'})
    }
};

module.exports = authenticateToken;
