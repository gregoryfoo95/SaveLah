const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userid: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
