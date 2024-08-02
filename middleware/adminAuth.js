const jwt = require('jsonwebtoken')
const config = require('../config/config')


const jwtAuth = (req, res, next) => {
    if (req.cookies && req.cookies.adminToken) {
        jwt.verify(req.cookies.adminToken, config.secret_key, (err, admin) => {
            req.admin = admin;
            next()
        })
    } else {
        next()
    }
}

const authCheck = (req, res, next) => {
    const token =req.body.token || req.query.token || req.headers["x-access-token"];

if (!token) {
    return res.status(403).send({ "status": false, "message": "A token is required for authentication" });
}
try {
    const decoded = jwt.verify(token, config.secret_key);
    req.admin = decoded;
   // console.log(req.user);
} catch (err) {
    return res.status(401).send({ "status": false, "message": "invalid Token Access" });
}
return next();

}

module.exports = {
    jwtAuth, authCheck
}