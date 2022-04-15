// middleware
const jwt = require('jsonwebtoken');

// mongoose
const mongoose =  require('mongoose')
const AppUser = mongoose.model('AppUser')

// dotenv
require('dotenv').config();

const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;

    

    if (!token) {
        return res.status(403).send('A token is required for authentication');
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY,  {
            complete: true
        });
        console.log(decoded)
        req.user = await AppUser.findById(decoded.payload.user_id);

    } catch (err) {
        console.log(err)
        return res.status(401).send('Invalid Token');
    }
    return next();
};

module.exports = verifyToken;
