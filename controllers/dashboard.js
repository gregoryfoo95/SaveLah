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
    const data = await getData();
    res.render('index', {
        username,
        categories,
        data
    });
};

const getData = async () => {
    let transactionArr = [];
    let sum = 0;
    const categories = await Category.find().exec();
    const transactions = await Transaction.find().populate("category_id").exec();
    categories.forEach((category) => {
        const category_name = category.category_name;
        const budget = category.budget;
        transactionArr.push({category_name: category_name,
                             budget: budget});
    })
    transactionArr.forEach((transactionObj) => {
        transactions.forEach((transaction) => {
        if (transaction.category_id.category_name === transactionObj.category_name ) {
            sum += transaction.amount;
        }
    })
        transactionObj["spent"] = sum;
        transactionObj["delta"] = transactionObj.budget - transactionObj.spent;
        sum = 0;
    })
    //console.log(transactionArr);
    return transactionArr;
}

/* const fetchData = async (req,res) => {
    const response = await fetch("http://localhost:3000/api/data");
    const data = await response.json();
    res.send(data);
    return data;
} */

module.exports = {
    home,
    dashboard,
    getData,
};