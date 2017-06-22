const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Model2Schema = new Schema({
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
  Model: mongoose.model('Model2', Model2Schema),
  Schema: Model2Schema,
};
