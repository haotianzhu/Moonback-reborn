var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  title: { type: String, required: true },
  content: Object,
  createDate: { type: Date, default: Date.now },
  modifyDate: { type: Date, default: Date.now },
  author: { type: mongoose.Schema.ObjectId, ref: 'user' },
});

//https://stackoverflow.com/questions/7034848/mongodb-output-id-instead-of-id
postSchema.set('toJSON', {
  virtuals: true,
  versionKey:false,
  transform: function (doc, ret) {   delete ret._id  }
});

postSchema.statics.execute = function (query, callback) {
  return this.find(query.select).skip(query.skip).limit(query.limit).sort(query.sort).exec(callback)
};

module.exports = mongoose.model('post', postSchema, 'posts');
