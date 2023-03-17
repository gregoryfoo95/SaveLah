const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const User = require("../models/User");
const mongoose = require("mongoose");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


const summary = async (req,res) => {
    try {
        const user_id = req.session.userid;
        const pattern = req.query.category_name_search;
        const user = await User.findById(user_id).exec();
        let partnerUser;
        if (user.couple_id) {
            const couple = await User.find({
            couple_id: user.couple_id
            }).exec();

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
        if (pattern) {
            const Re = new RegExp(pattern.toUpperCase());
            const categories = await Category.find({category_name: Re, user_id: [user_id,partnerUser._id]}).populate("user_id").exec();
            const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                 match: { 
                    user_id: user_id,
                    category_name: Re,
                },
                populate: {
                    path: "user_id",
                    select: "username"
                }
            })
            .exec();
            const context = {
                msg: "",
                transactions: transactions.filter((transaction) => {
                    return transaction.category_id !== null;
                }),
                categories,
            };
            res.render("transactions/summary", context);
        } else {
            const categories = await Category.find({user_id:[user_id,partnerUser._id]}).populate("user_id").exec();
            const transactions = await Transaction
            .find()
            .populate({
                path: "category_id",
                match: { user_id: [user_id,partnerUser._id] },
                populate: {
                    path: "user_id",
                    select: "username"
                }
            })
            .exec();
            console.log(transactions);
            const context = {
                msg: "",
                transactions: transactions.filter((transaction) => {
                    return transaction.category_id !== null;
                }),
                categories,
            };
        res.render("transactions/summary", context);
    }} catch(error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

const create = async (req, res) => {
    try {
        const { date, amount } = req.body;
        const user_id = req.session.userid;
        const user = await User.findById(user_id).exec();
        let partnerUser;
        if (user.couple_id) {
            const couple = await User.find({
            couple_id: user.couple_id
            }).exec();

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
        const categories = await Category.find({user_id: [user_id,partnerUser._id]}).populate("user_id").exec()
        let transactions = await Transaction
            .find()
            .populate({
                path: "category_id",
                match: { user_id: [user_id,partnerUser._id] },
                populate: {
                    path: "user_id",
                    select: "username"
                }
            })
            .exec();
        if (amount === "") {
            const context = {
                msg: "Amount fields should not be left empty.", 
                categories, 
                transactions: transactions.filter((transaction) => {
                return transaction.category_id !== null;
                }),
            }
            res.render("transactions/summary", context);
            return;
        } else if (amount < 0) {
            const context = {
                msg: "Amount fields should not be negative.", 
                categories, 
                transactions: transactions.filter((transaction) => {
                return transaction.category_id !== null;
                }),
            }
            res.render("transactions/summary", context);
            return;
        }
        await Transaction.create(
            {
                category_id: req.body.category_id,
                user_id: user_id,
                date: date,
                amount: amount,
            });
        transactions = await Transaction
            .find()
            .populate({
                path: "category_id",
                match: { user_id: [user_id,partnerUser._id] },
                populate: {
                    path: "user_id",
                    select: "username"
                }
            })
            .exec();
        const msg = `You have added a transaction.`;
        res.render("transactions/summary", {
            msg, 
            transactions: transactions.filter((transaction) => {
                return transaction.category_id !== null;
            }),
            categories
        });
    } catch (error) {
         if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

const editForm = async (req,res) => {
    try {
        const user_id = req.session.userid;
         const user = await User.findById(user_id).exec();
        let partnerUser;
        if (user.couple_id) {
            const couple = await User.find({
            couple_id: user.couple_id
            }).exec();

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
        const transaction_id = req.params.id;
        const transaction = await Transaction.findById(transaction_id).populate("category_id").exec();
        const categories = await Category.find({user_id: [user_id, partnerUser._id]}).populate("user_id").exec();
        const context = {msg: "", transaction, categories};
        res.render("transactions/edit", context);
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
                const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
                res.status(400).send(`Validation Error: ${errorMessage}`);
            } else {
                res.status(500).send('Internal Server Error');
            }
    }
}

const edit = async (req,res) => {
    try {
        const user_id = req.session.userid;
        const user = await User.findById(user_id).exec();
        let partnerUser;
        if (user.couple_id) {
            const couple = await User.find({
            couple_id: user.couple_id
            }).exec();

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
        const id = req.params.id;
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, {new:true}).exec();
        const transactions = await Transaction
            .find()
            .populate({
                path: "category_id",
                match: { user_id: [user_id,partnerUser._id] },
                populate: {
                    path: "user_id",
                    select: "username"
                }
            })
            .exec();
        const categories = await Category.find({user_id: [user_id, partnerUser._id]}).populate("user_id").exec();
        const context = {
            msg: `You have updated the transaction.`,
            transactions: transactions.filter((transaction) => {
                                return transaction.category_id !== null;
                            }),
            transaction,categories
        };
        res.render("transactions/summary", context)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

const del = async (req,res) => {
    const id = req.params.id;
    try {
        const user_id = req.session.userid;
        const user = await User.findById(user_id).exec();
        let partnerUser;
        if (user.couple_id) {
            const couple = await User.find({
            couple_id: user.couple_id
            }).exec();

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
        await Transaction.findByIdAndDelete(id).exec();
        const categories = await Category.find({user_id: [user_id, partnerUser._id]}).populate("user_id").exec();
        const transactions = await Transaction
            .find()
            .populate({
                path: "category_id",
                match: { user_id: [user_id,partnerUser._id] },
                populate: {
                    path: "user_id",
                    select: "username"
                }
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
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = {
    summary,
    create,
    editForm,
    edit,
    del
}