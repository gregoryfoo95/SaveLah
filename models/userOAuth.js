/* const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const userOAuthSchema = new Schema({
  name: String,
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String
}, {
  timestamps: true
});

module.exports = mongoose.model("UserOAuth", userOAuthSchema); */