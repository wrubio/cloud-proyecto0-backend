// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// init variables
var app = express();

// Import Routes
var appRoute = require('./routes/app');
var userRoute = require('./routes/user');
var eventRoute = require('./routes/event');
var loginRoute = require('./routes/login');

/**
 * BODYPARSER 
 * @parse application/x-www-form-urlencoded
 * @parse application/json
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Database connection
mongoose.connection.openUri('mongodb://localhost:27017/project0', (err, res) => {
    if (err) throw err;
    console.log('Base de datos \x1b[36m%s\x1b[0m', 'Conectada!')
});

// Routes 
app.use('/login', loginRoute);
app.use('/user', userRoute);
app.use('/event', eventRoute);
app.use('/', appRoute);

// Listen requires
app.listen(3000, () => {
    console.log(' Server Node/Express is listening in port: \x1b[36m%s\x1b[0m', '3000');
});