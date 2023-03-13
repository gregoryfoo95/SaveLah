const User = require("../models/User");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */

const home = async (req, res) => {
    res.render('home', {
        msg: ""
    });
};

const dashboard = async (req, res) => {
    const user_id = req.session.userid;
    const user = await User.findById(user_id);
    const username = user.username;
    const categories = await Category.find().exec()
    //Computation functions

    res.render('index', {
        username,
        categories,
    });
};

const calculator = async () => {
    //let budgetObj = {};
    const transactions = await Transaction.find().populate("category_id").exec();
    console.log(transactions);
}

module.exports = {
    home,
    dashboard,
    calculator
};