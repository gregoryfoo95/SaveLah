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
        const context = {msg: "",
                        categories};
        res.render("categories/summary", context);
    } catch(err) {
        res.send(404,"Categories cannot be shown")
    }
}

const create = async (req, res) => {
    try {
        cleanUp();
        await Category.create(
            {
                category_name: req.body.category_name,
                budget: req.body.budget,
                user_id: req.session.userid,
            });
        const categories = await Category.find().exec();    
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
    cleanUp(req,res);
    const id = req.params.id;
    try {
        await Category.findByIdAndUpdate(id, req.body, {new:true}).exec();
        const categories = await Category.find().exec();
        const context = {msg: `You have updated ${req.body.category_name}`, categories}
        res.render("categories/summary",context)
    } catch (err) {
        res.send(404, "Error updating category");
    }
}

const cleanUp = async (req,res) => {
    for (let key in req.body) {
        if (req.body[key] === '') delete req.body[key];
    }
}

module.exports = {
    summary,
    create,
    editForm,
    edit,
}