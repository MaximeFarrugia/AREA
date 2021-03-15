const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paramSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('param', paramSchema)