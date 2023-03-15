const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
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
        const pattern = req.query.category_name;
        console.log(pattern);
        if (pattern) {
            const Re = new RegExp(pattern.toUpperCase());
            const categories = await Category.find({category_name: Re, user_id: user_id}).exec();
            res.render("categories/summary", {msg: "", categories});
        } else {
            const categories = await Category.find({user_id: user_id}).exec();
            const context = {
                msg: "",
                categories
            };
            res.render("categories/summary", context);
        }
    } catch(error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

const create = async (req, res) => {
    const {category_name, budget} = req.body;
    const user_id = req.session.userid;
    try {
        let categories = await Category.find().exec();
        const category = await Category.find({category_name: category_name})
        if (category_name === "" || budget === "") {
            const context = {msg: "Category and Budget fields should not be left empty.", categories}
            res.render("categories/summary", context);
            return;
        } else if (budget < 0) {
            const context = {msg: "Budget should not be a negative amount!", categories}
            res.render("categories/summary", context);
            return;
        } else if (category.length) {
            const context = {msg: "There is an existing category of the same name.", categories}
            res.render("categories/summary", context);
            return;
        }
        await Category.create(
            {
                category_name: req.body.category_name.toUpperCase(),
                budget: req.body.budget,
                user_id: req.session.userid,
            }
        );
        categories = await Category.find({user_id: user_id}).exec();    
        const msg = `You have added ${req.body.category_name}.`;    
        res.render("categories/summary", {msg,categories});
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
        const id = req.params.id;
        const user_id = req.session.userid;
        const category = await Category.findById(id).exec();
        const categories = await Category.find({user_id: user_id}).exec();
        const context = {msg: "", category, categories};
        res.render("categories/edit", context);
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
        const id = req.params.id;
        const user_id = req.session.userid;
        await Category.findByIdAndUpdate(id, req.body, {new:true}).exec();
        const categories = await Category.find({user_id:user_id}).exec();
        const context = {msg: `You have updated ${req.body.category_name}.`, categories}
        res.render("categories/summary",context)
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
    try {
        const id = req.params.id;
        const user_id = req.session.userid;
        const transaction = await Transaction.find({category_id: id}).exec();
        if (!transaction.length) {
            const category = await Category.findById(id).exec();
            const msg = `You have deleted ${category.category_name}.`;
            await Category.findByIdAndDelete(id).exec();
            const categories = await Category.find({user_id: user_id}).exec();
            const context = {msg, categories}
            res.render("categories/summary",context);
        } else {
            const categories = await Category.find({user_id: user_id}).exec();
            const context = {msg: `You cannot delete this category as there are existing transactions tagged to it.`, categories}
            res.render("categories/summary",context);
        }
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