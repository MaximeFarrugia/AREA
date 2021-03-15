const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  params: [{ name: { type: String }, getOptions: { type: String } }]
});

module.exports = mongoose.model("reaction", reactionSchema);
