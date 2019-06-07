var mongoose = require('mongoose')
var Schema = mongoose.Schema

var getExpireDate = () => {
  var today = new Date()
  var tomorrow = new Date()
  tomorrow.setDate(today.getDate() + 1)
  return tomorrow
}

// this token is used for verification (not authetication)
var tokenSchema = new Schema({
  type: { type: String, required: true, default: 'email' },
  value: { type: String, required: true },
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' },
  date: { type: Date, required: true }
})

tokenSchema.statics.generateNewTokenDate = function (userId) {
  return { userId: userId, date: getExpireDate(), value: (Math.floor(Math.random() * 90000) + 10000).toString() }
}

tokenSchema.index({ type: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model('token', tokenSchema, 'tokens')
