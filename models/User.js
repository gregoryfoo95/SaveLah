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
                minlength: 8,
    },
    monthly_salary: {type: Number,
                     required: true,
    },
    gender: {type: String,
             required: true,
    },

    dob: { type: Date,
           required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
