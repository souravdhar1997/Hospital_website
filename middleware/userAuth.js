const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

//password hashing
const hashPassword = async (password) => {
    const saltRounds = 10;
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash;
    } catch (error) {
        console.log(error);
    }
}

// token creation
const createToken = async (userDetails) => {
    try {
        const token = jwt.sign( userDetails , config.secret_key, { expiresIn: "1d" })
        return token;
    } catch (error) {
        console.log(error);
    }
}

//compare passwords
const comparePasswords = async (password, hashPassword) => {
    const comparedPwd = await bcrypt.compare(password, hashPassword)
    return comparedPwd;
}

//auth middleware
const jwtAuth = async (req, res, next) => {
    if (req.cookies && req.cookies.tokenData) {
        await jwt.verify(req.cookies.tokenData, config.secret_key, (err, data) => {
            req.user = data
            next()
        })
    } else {
       next()
    }
}

module.exports = {
    hashPassword, createToken, comparePasswords, jwtAuth
}