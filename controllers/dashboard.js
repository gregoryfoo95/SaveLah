const User = require("../models/User");
const Category = require("../models/Category");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */

const home = async (req, res) => {
    res.render('home', {
        title: "SaveLah!",
        msg: "",
    });
};

const dashboard = async (req, res) => {
    const {username} = req.body;
    const user = await User.findOne({ username })
    const categories = await Category.find().exec()
    res.render('index', {
        title: "SaveLah!",
        user,
        categories,
        msg: "",
    });
};

module.exports = {
    home,
    dashboard
};