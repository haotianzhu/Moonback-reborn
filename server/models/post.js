var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: String,
  content: Object,
  createDate: { type: Date, default: Date.now },
  modifyDate: { type: Date, default: Date.now },
});

postSchema.statics.execute = function(query, callback) {
  return this.find(query.select).skip(query.skip).limit(query.limit).sort(query.sort).exec(callback)
};

module.exports = mongoose.model('post', postSchema, 'posts');
