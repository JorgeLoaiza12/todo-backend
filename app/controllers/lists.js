var parse      = require('co-body'),
    mongoose   = require('mongoose'),
    _          = require('lodash'),
    co         = require('co'),
    taskRoutes = require('./tasks'),
    List       = mongoose.model('List'),
    Task       = mongoose.model('Task'),
    router     = require('koa-router')({ prefix: '/lists' });

router.get('/', function* (next) {
    this.body = yield List.find({});
});

router.get('/:list', function* (next) {
    this.body = this.list;
});

router.post('/', function* (next) {
    this.body = yield List.create(yield parse(this));
});

router.put('/:list', function* (next) {
    var body = yield parse(this);
    this.list.name = body.name;
    this.body = yield this.list.save();
});

router.delete('/:list', function* (next) {
    this.body = yield this.list.remove();
});

router.delete('/:list/tasks/:task', function* (next) {
    var list = this.list, task = this.task;
    yield co(function* () {
        yield [
            list.update({
                $pull: { tasks: task._id }
            }),
            task.remove()
        ]
    });
    this.body = yield List.findById(this.list._id);
});

router.post('/:list/tasks', function* (next) {
    var task = new Task(yield parse(this));
    yield task.save();
    this.list.tasks.push(task);
    yield this.list.save();
    this.body = task;
})

router.param('list', function* (value, next) {
    try {
        this.list = yield List.findById(value);
    } catch (err) {
        return this.status = 404;
    }
    if (!this.list) return this.status = 404;
    yield next;
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
