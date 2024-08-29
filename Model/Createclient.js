const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  projectId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Clients = mongoose.model('Client', ClientSchema);
module.exports = Clients;
