var parse      = require('co-body'),
    mongoose   = require('mongoose'),
    Task       = mongoose.model('Task'),
    router     = require('koa-router')({ prefix: '/tasks' });

router.get('/:task', function* () {
    this.body = this.task;
});

router.put('/:task', function* () {
    var body = yield parse(this);
    this.task.text = body.text;
    this.task.done = body.done;
    this.body = yield this.task.save();
});

router.param('task', function* (value, next) {
    try {
        this.task = yield Task.findById(value);
    } catch (err) {
        return this.status = 404;
    }
    if (!this.task) return this.status = 404;
    yield next;
});

module.exports = router.routes();
