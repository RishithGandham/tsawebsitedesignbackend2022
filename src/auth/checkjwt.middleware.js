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
        console.log(decoded);
        // use the user id to get the  user from the database and return an error if the user does not exist
        const user = await AppUser.findById(decoded.payload.user_id);
        console.log(user);
        if (!user) {
            
            return res.status(403).send('Invalid token');
        }
        
        req.user = user;
        

    } catch (err) {
        console.log(err)
        return res.status(401).send('Invalid Token');
    }
    return next();
};

module.exports = verifyToken;
