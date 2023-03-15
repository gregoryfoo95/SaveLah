const mongoose = require("mongoose");
const Joi = require('joi');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    category_id: { type: Schema.Types.ObjectId,
                ref: "Category",
                required:true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          const schema = Joi.date().required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: props => `${props.value} is not a valid date format!`
      },
      max: new Date()
    },
        
    amount: {type: Number,
             required: true,
             validate: {
              validator: function (value) {
                const schema = Joi.number().min(0).required();
                const { error } = schema.validate(value);
                return error ? false : true;
              },
              message: (props) =>
                `${props.value} is not a valid expenditure amount. Must be greater than or equals to 0.`,
            },
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
