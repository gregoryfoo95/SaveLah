const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const User = require("../models/User");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


const summary = async (req,res) => {
    try {
        const categories = await Category.find().exec();
        const transactions = await Transaction.find().populate("category_id").exec();
        console.log(transactions);
        const context = {msg: "",
                        transactions,
                        categories,
                    };
        res.render("transactions/summary", context);
    } catch(err) {
        res.send(404,"Transactions cannot be shown")
    }
}

const create = async (req, res) => {
    try {
        //console.log(req.body);
        const categories = await Category.find().exec()
        await Transaction.create(
            {
                category_id: req.body.category_id,
                user_id: req.session.userid,
                date: req.body.date,
                amount: req.body.amount,
            });
        const transactions = await Transaction.find().populate("category_id").exec();
        const msg = `You have added a transaction`;
        res.render("transactions/summary", {msg, transactions, categories});
    } catch (err) {
        res.send(404, "Error adding transaction");
    };
}

module.exports = {
    summary,
    create
}