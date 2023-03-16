const User = require("../models/User");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
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
    try {
        const user_id = req.session.userid;
        const user = await User.findById(user_id).exec();
        const [data,catArr,budgetArr,spentArr,deltaArr] = await getData(req);
        res.render('index', {
            user: user,
            username: user.username,
            user_permission: user.user_permission,
            data: data,
            catArr: catArr,
            budgetArr: budgetArr,
            spentArr: spentArr,
            deltaArr: deltaArr,
            msg:"",
        })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
                const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
                res.status(400).send(`Validation Error: ${errorMessage}`);
            } else {
                res.status(500).send('Internal Server Error');
            }
    }
};

const getData = async (req) => {
    let transactionArr = [];
    let catArr = [];
    let budgetArr = [];
    let spentArr = [];
    let deltaArr=[];
    let sum = 0;
    const user_id = req.session.userid;
    const user = await User.findById(user_id).exec();
    let partnerUser;
    if (user.couple_id) {
        const couple = await User.find({
        couple_id: user.couple_id
        }).exec();
        console.log(couple)
        
        if (couple.length === 2) {
            if (couple[0]._id.equals(user_id)) {
                partnerUser = await User.findById(couple[1]._id).exec();
            } else {
                partnerUser = await User.findById(couple[0]._id).exec();
            }
        } else {
            partnerUser = "";
        }
    } else {
        partnerUser = "";
    }
    const categories = await Category.find({user_id: [user_id, partnerUser._id]}).exec();
    const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: [user_id, partnerUser._id] }
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

const fetchData = async (req,res) => {
    const data = await getData(req);
    res.send(data);

}

module.exports = {
    home,
    dashboard,
    getData,
    fetchData
};