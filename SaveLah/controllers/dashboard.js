const User = require("../models/User");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */

const home = async (req, res) => {
    res.render('home', {
        title: "SaveLah!",
    });
};

const dashboard = async (req, res) => {
    const {username,password} = req.body;
    const user = await User.findOne({ username })
    const context = {user }
    res.render('index', {
        title: "SaveLah!",
    });
};

module.exports = {
    home,
    dashboard
};