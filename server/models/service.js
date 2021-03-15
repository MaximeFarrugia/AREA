const mongoose = require('mongoose')
const Schema = mongoose.Schema

const serviceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  accountProvider: {
    type: Schema.Types.ObjectId,
    ref: 'accountProvider'
  },
  actions: [{
    type: Schema.Types.ObjectId,
    ref: 'action'
  }],
  reactions: [{
    type: Schema.Types.ObjectId,
    ref: 'reaction'
  }]
})

module.exports = mongoose.model('service', serviceSchema)