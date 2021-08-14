const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
    // Get token from the header
    const token = req.header('x-auth-token');

    // check if there is no token in the header
    if (!token) {
        return res.status(401).json({ msg: 'No token, please try again' });
    }

    // verify the token if it's valid
    try {
        const decode = jwt.verify(token, config.get('jwtSecret'));

        req.user = decode.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}