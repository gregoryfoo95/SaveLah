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
        await Category.create(
            {
                category_name: req.body.category_name,
            });
        const categories = await Category.find().exec();    
        const msg = `You have added ${req.body.category_name}`;    
        res.render("categories/summary", {msg,categories});
    } catch (err) {
        res.send(404, "Error adding category");
    };
}


module.exports = {
    summary,
    create,
}