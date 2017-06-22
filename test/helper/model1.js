const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model1Schema = new Schema({
  state: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = {
  Model: mongoose.model('Model1', Model1Schema),
  Schema: Model1Schema,
};
