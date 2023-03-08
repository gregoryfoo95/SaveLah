const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const budgetSchema = new Schema(
  {
    category_id: { type: Schema.Types.ObjectId,
                ref: "Category",
    },
    amount: {type: Number,
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Budget", budgetSchema);
