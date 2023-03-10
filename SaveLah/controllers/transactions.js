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
        const categories = await Category.find().exec();
        const transactions = await Transaction.find().populate("category_id").exec();
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

const editForm = async (req,res) => {
    try {
        const transaction_id = req.params.id;
        const transaction = await Transaction.findById(transaction_id).populate("category_id").exec();
        console.log(new Date(transaction.date).toJSON().slice(0,10));
        console.log(new Date().toJSON().slice(0, 10));
        const categories = await Category.find().exec();
        const context = {msg: "", transaction, categories};
        res.render("transactions/edit", context);
} catch (err) {
    res.send(404, "Error opening edit form.")
};
}

const edit = async (req,res) => {
    try {
        const id = req.params.id;
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, {new:true}).exec();
        const transactions = await Transaction.find().populate("category_id").exec();
        const categories = await Category.find().exec();
        const context = {msg: `You have updated the transaction.`, transactions, transaction,categories}
        res.render("transactions/summary", context)
    } catch (err) {
        res.send(404, "Error updating transaction");
    }
}

const del = async (req,res) => {
    const id = req.params.id;
    try {
        await Transaction.findByIdAndDelete(id).exec();
        const categories = await Category.find().exec();
        const context = {msg: `You have deleted a transaction.`}
        res.render("transactions/summary", context);
    } catch (err) {
        res.send(404,"Error deleting transaction")
    }
}

module.exports = {
    summary,
    create,
    editForm,
    edit,
    del
}