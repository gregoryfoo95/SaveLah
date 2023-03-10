const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    category_name: { type: String,
                required: true,
    },
    user_id: {type: Schema.Types.ObjectId,
              required: true,
              ref: "User",
    },

    budget: {type: Number,
             required: true,
             min: [0, "Must be >= 0!"],
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
