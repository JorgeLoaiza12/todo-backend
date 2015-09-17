var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var taskSchema = new Schema({
    text: { type: String, required: true },
    done: { type: Boolean, default: false }
});

mongoose.model('Task', taskSchema);
