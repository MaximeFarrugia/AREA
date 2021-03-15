const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountProviderSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  token: { type: String },
  refreshToken: { type: String }
})

module.exports = mongoose.model('accountProvider', accountProviderSchema)