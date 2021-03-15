const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: 'service'
    }
  ],
  areas: [{
    type: Schema.Types.ObjectId,
    ref: 'config'
  }]
})

module.exports = mongoose.model('user', userSchema)