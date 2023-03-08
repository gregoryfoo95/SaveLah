const Category = require("../models/Category");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


const summary = async (req,res) => {
    const context = {msg: ""};
    res.render("categories/summary",context);
}

const create = async (req, res) => {
    try {
        await Category.create(
            {
                category_name: req.body.category_name,
                user_id: req.body.user_id, 
            });
            res.redirect("/categories");
    } catch (err) {
        res.send(404, "Error adding category");
    };
}

module.exports = {
    summary,
    create,
}