var koa = require('koa'),
    fs = require('fs'),
    path = require('path'),
    compress = require('koa-compress'),
    cors = require('koa-cors'),
    logger = require('koa-logger'),
    mongoose = require('mongoose');

module.exports = (app) => {
    app.use(compress());
    app.use(cors());
    app.use(logger());

    var controllersPath = path.join(__dirname, '../app/controllers');

    app.use(function* (next) {
        try {
            yield next;
        } catch (err) {
            this.status = err.status || 500;
            this.body = { message: err.message };
            this.app.emit('error', err, this);
        }

        if (this.status != 404) return;

        this.body = { message: 'NotFound' };
    });

    fs.readdirSync(controllersPath).forEach(function (file) {
        if (/\.js$/.test(file)) {
            app.use(require(controllersPath + '/' + file));
        }
    });
};
