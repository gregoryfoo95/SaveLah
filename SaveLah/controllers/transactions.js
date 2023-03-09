const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


const summary = async (req,res) => {
    try {
        const categories = await Category.find({}).exec()
        const transactions = await Transaction.find({}).exec();
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

        const transactions = await Transaction.create(
            {
                date: req.body.date,
                amount: req.body.amount,
            });
        const msg = `You have added a transaction`;
        res.render("transactions/summary", {msg, transactions});
    } catch (err) {
        res.send(404, "Error adding transaction");
    };
}

module.exports = {
    summary,
}