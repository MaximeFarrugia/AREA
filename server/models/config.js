const mongoose = require('mongoose')
const Schema = mongoose.Schema

const configSchema = new Schema({
  action: {
    action: {
      type: Schema.Types.ObjectId,
      ref: 'action'
    },
    params: [{
      type: Schema.Types.ObjectId,
      ref: 'param'
    }]
  },
  reaction: {
    reaction: {
      type: Schema.Types.ObjectId,
      ref: 'reaction'
    },
    params: [{
      type: Schema.Types.ObjectId,
      ref: 'param'
    }]
  }
})

module.exports = mongoose.model('config', configSchema)