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
    const user_permission = user.user_permission;
    const [data,catArr,budgetArr,spentArr,deltaArr] = await getData(req);
    res.render('index', {
        username: username,
        user_permission: user_permission,
        data: data,
        catArr: catArr,
        budgetArr: budgetArr,
        spentArr: spentArr,
        deltaArr: deltaArr,
        msg:"",
    });
};

const getData = async (req) => {
    let transactionArr = [];
    let catArr = [];
    let budgetArr = [];
    let spentArr = [];
    let deltaArr=[];
    let sum = 0;
    const user_id = req.session.userid;
    const categories = await Category.find({user_id:user_id}).exec();
    const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
    categories.forEach((category) => {
        const category_name = category.category_name;
        const budget = category.budget;
        transactionArr.push({category_name: category_name,
                             budget: budget});
    })
    transactionArr.forEach((transactionObj) => {
        transactions.forEach((transaction) => {
            if (transaction.category_id && transaction.category_id.category_name === transactionObj.category_name ) {
                sum += transaction.amount;
            }
        });
        transactionObj["spent"] = sum;
        transactionObj["delta"] = transactionObj.budget - transactionObj.spent;
        catArr.push(transactionObj.category_name);
        budgetArr.push(transactionObj.budget);
        spentArr.push(transactionObj.spent);
        deltaArr.push(transactionObj.delta);
        sum = 0;
    })
    return [transactionArr,catArr,budgetArr,spentArr,deltaArr];
}


module.exports = {
    home,
    dashboard,
    getData,
};