var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    id: String | Int32Array,
    commentOwnerId: String,
    commentContent: String,
    lastEdited: Number,
    tags: [String],
    children: [String],
    parent: String,
    root: String,
})

module.exports = mongoose.model('comment',commentSchema,'comments');