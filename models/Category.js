const mongoose = require("mongoose");
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;
const Joi = require('joi');

const categorySchema = new Schema(
  {
    category_name: { 
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const schema = Joi.string().min(1).max(30).required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: (props) =>
          `${props.value} is not a valid category name. Must be between 1 and 30 characters.`,
      },
    },
    user_id: {type: Schema.Types.ObjectId,
              required: true,
              ref: "User",
    },

    budget: {type: Number,
             required: true,
             validate: {
              validator: function (value) {
                return value > 0;
              },
              message:"Budget must be greater than 0",
             }
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
