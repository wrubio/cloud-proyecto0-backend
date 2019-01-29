// Requires
var express = require('express');
var mongoose = require('mongoose');

// Database connection
mongoose.connection.openUri('mongodb://localhost:27017/project0', (err, res) => {
    if (err) throw err;
    console.log('Base de datos \x1b[36m%s\x1b[0m', 'Conectada!')
});

// init variables
var app = express();

// Listen requires
app.listen(3000, () => {
    console.log(' Server Node/Express is listening in port: \x1b[36m%s\x1b[0m', '3000');
})