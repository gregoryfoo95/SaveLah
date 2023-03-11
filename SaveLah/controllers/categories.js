const Category = require("../models/Category");
const Transaction = require("../models/Transaction");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


const summary = async (req,res) => {
    try {
        const categories = await Category.find().exec();
        const context = {msg: "",
                        categories};
        res.render("categories/summary", context);
    } catch(err) {
        res.send(404,"Categories cannot be shown")
    }
}

const create = async (req, res) => {
    const {category_name, budget} = req.body;
    try {
        let categories = await Category.find().exec(); 
        if (category_name === "" || budget === "") {
            const context = {msg: "Category and Budget fields should not be left empty.", categories}
            res.render("categories/summary", context);
            return;
        } else if (budget < 0) {
            const context = {msg: "Budget should not be a negative amount!", categories}
            res.render("categories/summary", context);
            return;
        }
        await Category.create(
            {
                category_name: req.body.category_name,
                budget: req.body.budget,
                user_id: req.session.userid,
            });
        categories = await Category.find().exec();    
        const msg = `You have added ${req.body.category_name}`;    
        res.render("categories/summary", {msg,categories});
    } catch (err) {
        res.send(404, "Error adding category");
    };
}


const editForm = async (req,res) => {
    const id = req.params.id;
    const category = await Category.findById(id).exec();
    const context = {msg: "", category};
    res.render("categories/edit", context);
}

const edit = async (req,res) => {
    try {
        const id = req.params.id;
        await Category.findByIdAndUpdate(id, req.body, {new:true}).exec();
        const categories = await Category.find().exec();
        const context = {msg: `You have updated ${req.body.category_name}.`, categories}
        res.render("categories/summary",context)
    } catch (err) {
        res.status(404)
        .json({msg: "Error updating category"})
    }
}

const del = async (req,res) => {
    const id = req.params.id;
    try {
        const transaction = await Transaction.find({category_id: id}).exec();
        if (transaction === null) {
            await Category.findByIdAndDelete(id).exec();
            //await Transaction.deleteMany({category_id: id});
            const categories = await Category.find().exec();
            const context = {msg: `You have deleted ${req.body.category_name}`, categories}
            res.render("categories/summary",context);
    } else {
        const categories = await Category.find().exec();
        const context = {msg: `You cannot delete this category as there are existing transactions tagged to it.`, categories}
        res.render("categories/summary",context);
    }} catch (err) {
        res.send(404,"Error deleting category")
    }
}


module.exports = {
    summary,
    create,
    editForm,
    edit,
    del
}