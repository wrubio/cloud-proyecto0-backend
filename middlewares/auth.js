var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/**
 * TOKEN
 * Verify token
 */
exports.verifyToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'incorrect token, unauthorized user',
                errors: err
            })
        }

        req.dUser = decoded.user;

        next();
    })

}