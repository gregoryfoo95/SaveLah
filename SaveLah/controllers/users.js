const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;


/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */

const index = async (req,res) => {
    const context = {msg: ""};
    res.render("users/login",context);
}

module.exports = {
    index,
};