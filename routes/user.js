var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAuth = require('../middlewares/auth');

var app = express();

// Imports
var User = require('../models/user');

/*****************************************************************************
 * GET 
 * Find users
 */
app.get('/', (req, res, next) => {

    var filterFrom = req.body.filter || 0;
    filterFrom = Number(filterFrom);

    User.find({}, 'name lastname email role')
        .skip(filterFrom)
        .limit(5)
        .exec((err, users) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding users',
                    errors: err
                })
            }

            User.count({}, (err, count) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Ups! something grong',
                        errors: err
                    })
                }

                res.status(200).json({
                    ok: true,
                    users: users,
                    totalUsers: count
                })
            })
        })

});

/*****************************************************************************
 * POST 
 * Create new users
 */
app.post('/', (req, res) => {

    var body = req.body;

    var isBodyEmpty = Object.keys(body);
    var keyEmpty = '';

    // Validate empty object
    if (isBodyEmpty[0] !== '') {

        Object.keys(body).map((key, i) => {
            if (body[key].length === 0) keyEmpty = key;
        })

        if (keyEmpty !== '') {
            return res.status(400).json({
                ok: false,
                message: `The field ${keyEmpty} can.t be empty`
            })
        }

        // Create the new user
        var user = new User({
            name: body.name,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10)
        });

        // Save new user in database
        user.save((err, saveUser) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Ups1,  we can,t save your news values',
                    errors: err
                });
            }

            saveUser.password = ':)';

            res.status(201).json({
                ok: true,
                message: saveUser,
                originUser: req.dUser
            })

        });

    } else {
        return res.status(400).json({
            ok: false,
            message: 'The fields can.t be empty'
        })
    }

});

/*****************************************************************************
 * PUT
 * Update users
 */
app.put('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;
    var isBodyEmpty = Object.keys(body);
    var keyEmpty = '';

    // Validate empty object
    if (isBodyEmpty[0] !== '') {

        Object.keys(body).map((key, i) => {
            if (body[key].length === 0) keyEmpty = key;
        })

        if (keyEmpty !== '') {
            return res.status(400).json({
                ok: false,
                message: `The field ${keyEmpty} can't be empty`
            })
        }

        // Find the user by id
        User.findById(id, (err, user) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    meesage: "User not found",
                    errors: err
                });
            }

            if (!user) {
                return res.status(400).json({
                    ok: false,
                    meesage: `User with ${id} does not exist`,
                    errors: err
                });
            }

            // Assign new user data to the found user
            user.name = body.name;
            user.lastname = body.lastname;
            user.email = body.email;

            // Update user data
            user.save((err, saveUser) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Ups1,  the user could not save',
                        errors: err
                    });
                }

                saveUser.password = ';)';

                res.status(200).json({
                    ok: true,
                    message: saveUser,
                    originUser: req.dUser
                })
            })

        });

    } else {
        return res.status(400).json({
            ok: false,
            message: 'The fields can.t be empty'
        })
    }
});

/*****************************************************************************
 * DELETE
 * Delete users
 */
app.delete('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;

    User.findByIdAndDelete(id, (err, deleteUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                meesage: "User could not be deleted",
                errors: err
            });
        }

        if (!deleteUser) {
            return res.status(400).json({
                ok: false,
                meesage: `User with ${id} does not exist`,
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            message: `User ${deleteUser.name} ${deleteUser.lastname} was deleted`,
            originUser: req.dUser
        })
    })
})

module.exports = app;