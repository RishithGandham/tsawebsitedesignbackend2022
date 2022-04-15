// this code is not in use

const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const AppUser = mongoose.model('AppUser');

const getAppUserFromReq = async function (req, res) {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.decode(token, {
            complete: true,
        });
    
        return await AppUser.findById(decoded.payload.user_id);
    } catch (error) {
        console.log(error);
        return;

    }
};

module.exports = getAppUserFromReq;
