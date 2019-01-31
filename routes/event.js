var express = require('express');
var mdAuth = require('../middlewares/auth');

var app = express();

// Imports
var Event = require('../models/event');

/*****************************************************************************
 * GET 
 * Find events
 */
app.get('/', (req, res, next) => {

    var filterFrom = req.body.filter || 0;
    filterFrom = Number(filterFrom);

    Event.find({})
        .skip(filterFrom)
        .populate('user', 'name lastname email')
        .exec((err, event) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error finding event',
                    errors: err
                })
            }

            Event.count({}, (err, count) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Ups! something grong',
                        errors: err
                    })
                }

                res.status(200).json({
                    ok: true,
                    event: event,
                    total: count
                })
            })

        })

});

/*****************************************************************************
 * POST 
 * Create new event
 */
app.post('/', mdAuth.verifyToken, (req, res) => {

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

        // Create the new user
        var event = new Event({
            name: body.name,
            created: new Date(),
            description: body.description,
            startDate: new Date(body.startDate),
            endDate: new Date(body.endDate),
            user: req.dUser._id
        });

        // Save new user in database
        event.save((err, saveEvent) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Ups1,  we can,t save your news values',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                message: saveEvent,
                originUser: req.dUser
            })

        });

    } else {
        return res.status(400).json({
            ok: false,
            message: "The fields can't be empty"
        })
    }

});

/*****************************************************************************
 * PUT
 * Update event
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
                message: `The field ${keyEmpty} can.t be empty`
            })
        }

        // Find the user by id
        Event.findById(id, (err, event) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    meesage: "Event not found",
                    errors: err
                });
            }

            if (!event) {
                return res.status(400).json({
                    ok: false,
                    meesage: `Event with ${id} does not exist`,
                    errors: err
                });
            }

            // Assign new user data to the found user
            event.name = body.name;
            event.created = new Date();
            event.description = body.description;
            event.startDate = new Date(body.startDate);
            event.endDate = new Date(body.endDate);
            // event.img = body.img;
            // event.user = body.user;
            event.user = req.dUser._id;

            console.log(body);

            // Update user data
            event.save((err, saveEvent) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Ups1,  the user could not save',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    message: saveEvent,
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
 * Delete events
 */
app.delete('/:id', mdAuth.verifyToken, (req, res) => {

    var id = req.params.id;

    Event.findByIdAndDelete(id, (err, deleteEvent) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                meesage: "Event could not be deleted",
                errors: err
            });
        }

        if (!deleteEvent) {
            return res.status(400).json({
                ok: false,
                meesage: `Event with ${id} does not exist`,
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            message: `Event ${deleteEvent.name} was deleted`,
            originUser: req.dUser
        })
    })
})

module.exports = app;