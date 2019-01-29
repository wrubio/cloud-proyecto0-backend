var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

// Imports
var User = require('../models/user');

app.post('/', (req, res) => {

    var body = req.body;

    User.findOne({ email: body.email }, (err, foundUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Ups, user could not be found',
                errors: err
            })
        }

        if (!foundUser) {
            return res.status(400).json({
                ok: false,
                message: "Incorrect user credentials",
                errors: err
            })
        }

        if (!bcrypt.compareSync(body.password, foundUser.password)) {
            return res.status(400).json({
                ok: false,
                message: "Incorrect user credentials",
                errors: err
            })
        }

        foundUser.password = ':)';

        var token = jwt.sign({ user: foundUser }, SEED, { expiresIn: 14400 });

        res.status(200).json({
            ok: true,
            user: foundUser,
            token: token
        })
    })
})

module.exports = app;