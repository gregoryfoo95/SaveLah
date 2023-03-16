const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema(
  {
    username: { 
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(value) {
          const schema = Joi.string().alphanum().min(1).max(30).required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: props => `${props.value} is not a valid username!`,
      },
    },
    password: { 
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function(value) {
          const schema = Joi.string().min(8).required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: props => `${props.value} is not a valid password!`,
      }
    },
    
    monthly_salary: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
        const schema = Joi.number().min(0).required();
        const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: (props) =>
          `${props.value} is not a valid salary amount. Must be greater than or equals to 0.`,
      },
    },

    gender: {
      type: String,
      required: true,
    },

    dob: {
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

    user_permission: {
      type: String,
      required: true,
    },

    partner_username: {
      type: String,
    },

    token: {
      type: String
    },

    couple_id: {
      type: Schema.Types.ObjectId,
      ref: "Couple"
    }
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
