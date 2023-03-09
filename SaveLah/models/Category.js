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
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
