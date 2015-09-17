var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var listSchema = new Schema({
    name: { type: String, required: true },
    tasks: { type: [ObjectId], ref: 'Task', autopopulate: true }
});

listSchema.plugin(require('mongoose-autopopulate'));

mongoose.model('List', listSchema);
