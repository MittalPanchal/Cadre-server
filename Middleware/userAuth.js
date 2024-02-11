const jwt = require('jsonwebtoken');
const User = require('../Model/userModel');


const authenticateJWT = async(req, res, next) => {

    const { authorization } = req.headers   

    if (!authorization) {
        return res.status(401).json({ error: 'Token is reuired'});
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findOne({_id}).select('_id');
        next();

    } catch (error) {
        res.status(401).send({error: 'Token is expired!'});
    };
};

module.exports = authenticateJWT;
