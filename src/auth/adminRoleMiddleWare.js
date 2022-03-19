const getAppUserFromReq = require('./getAppUserFromJWT');

const checkIfAdmin = async (req, res, next) => {
    const appUser = await getAppUserFromReq(req);
    const isUserAdmin = appUser.admin;
    isUserAdmin
        ? next()
        : res
              .status(403)
              .send('You cannot access this resource, you are not an admin');
};

module.exports = checkIfAdmin;
