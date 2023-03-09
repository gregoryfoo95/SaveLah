const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String,
                required: true,
                unique: true,
    },
    password: { type: String,
                required: true,
    },
    monthly_salary: Number,
    gender: String,
    dob: Date,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
