var app = require('koa')(),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/todo-backend');

mongoose.connection.on('error', (err) => {throw err});

var modelsPath = path.normalize(__dirname+ '/app/models');

fs.readdirSync(modelsPath).forEach((file) => {
    if (/\.js$/.test(file)) {
        require(modelsPath + '/' + file);
    }
});

require('./config/koa')(app);

app.listen(3000);

module.exports = app;
