const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    category_id: { type: Schema.Types.ObjectId,
                ref: "Category",
    },
    date: Date,
    amount: {type: Number,
            require: true,
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
