var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  id: String | Int32Array,
  postOwnerId: String,
  title: String,
  postContent: Object,
  branch: String,
  lastEdited: Number,
  tags: [String],
  comment: [String],
});

module.exports = mongoose.model('post',postSchema,'posts');
