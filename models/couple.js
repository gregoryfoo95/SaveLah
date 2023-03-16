const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require('joi');

const coupleSchema = new Schema(
    {
        status: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                const schema = Joi.number().min(0).max(1).required();
                const { error } = schema.validate(value);
                return error ? false : true;
            },
            message: (props) =>
                `${props.value} is not a valid couple status. Must be either 0 or 1.`,
            },
        },
    },
  
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Couple", coupleSchema);
