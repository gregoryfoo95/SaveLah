const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    category_id: { type: Schema.Types.ObjectId,
                ref: "Category",
                required:true,
    },
    user_id: { type: Schema.Types.ObjectId,
               ref: "User",
               required: true,
    }, //potentially create inconsistencies 
    date: {type: Date,
           required: true,
    
      },
        
    amount: {type: Number,
            required: true,
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
