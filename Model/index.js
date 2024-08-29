const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
