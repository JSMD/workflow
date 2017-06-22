const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model3Schema = new Schema({
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
  Model: mongoose.model('Model3', Model3Schema),
  Schema: Model3Schema,
};
