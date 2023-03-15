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
        const user_id = req.session.userid;
        const categories = await Category.find({user_id:user_id}).exec();
        const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
            const context = {msg: "",
                            transactions: transactions.filter((transaction) => {
                                return transaction.category_id !== null;
                            }),
                            categories,
                        };
            res.render("transactions/summary", context);
    } catch(err) {
        res.send(404,"Transactions cannot be shown")
    }
}

const create = async (req, res) => {
    try {
        const user_id = req.session.userid;
        const categories = await Category.find({user_id: user_id}).exec()
        await Transaction.create(
            {
                category_id: req.body.category_id,
                user_id: user_id,
                date: req.body.date,
                amount: req.body.amount,
            });
        const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
        const msg = `You have added a transaction`;
        res.render("transactions/summary", {
            msg, 
            transactions: transactions.filter((transaction) => {
                                return transaction.category_id !== null;
                            }),
            categories
        });
    } catch (err) {
        res.send(404, "Error adding transaction");
    }
}

const editForm = async (req,res) => {
    try {
        const user_id = req.session.userid;
        const transaction_id = req.params.id;
        const transaction = await Transaction.findById(transaction_id).populate("category_id").exec();
        const categories = await Category.find({user_id: user_id}).exec();
        const context = {msg: "", transaction, categories};
        res.render("transactions/edit", context);
} catch (err) {
    res.send(404, "Error opening edit form.")
}
}

const edit = async (req,res) => {
    try {
        const user_id = req.session.userid;
        const id = req.params.id;
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, {new:true}).exec();
        const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
        const categories = await Category.find({user_id: user_id}).exec();
        const context = {
            msg: `You have updated the transaction.`,
            transactions: transactions.filter((transaction) => {
                                return transaction.category_id !== null;
                            }),
            transaction,categories
        };
        res.render("transactions/summary", context)
    } catch (err) {
        res.send(404, "Error updating transaction");
    }
}

const del = async (req,res) => {
    const id = req.params.id;
    try {
        const user_id = req.session.userid;
        await Transaction.findByIdAndDelete(id).exec();
        const categories = await Category.find({user_id: user_id}).exec();
        const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
        const context = {
            msg: `You have deleted a transaction.`, 
            categories, 
            transactions: transactions.filter((transaction) => {
                            return transaction.category_id !== null;
            }),
        };
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