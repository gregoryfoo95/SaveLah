const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;


/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */


const loginPage = async (req,res) => {
    const context = {msg: ""};
    res.render("users/login",context);
}

const registerPage = async (req,res) => {
    const context = {msg: ""};
    res.render("users/register",context);
}

const register = async (req,res) => {
    try {
        if (req.body.password === req.body.password2) {
            bcrypt.hash(req.body.password, saltRounds, async(err,hash) => {
            await User.create(
                { username: req.body.username,
                password: hash,
                monthly_salary: req.body.monthly_salary,
                gender: req.body.gender,
                dob: req.body.dob,
                });
            res.redirect("/users/login");
        });
        } else {
            res.render("users/register", {msg: "Your passwords do not match"});
            return;
        }
    } catch(err) {
            res.send(404, "Error creating user");
        }
}

const login = async (req,res) => {
    const {username,password} = req.body;
    const user = await User.findOne({ username })
    try {
    if (user===null) {
        const context = {msg: "No user was found"}
        res.render("users/login", context);
        return;
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
        req.session.userid = user._id;
        res.redirect("/dashboard");
        } else {
        const context = { msg: "Password is wrong" };
        res.render("users/login", context);
        }
    });
    } catch(err) {
        res.send(404, "Error with login");
    }
}


module.exports = {
    loginPage,
    registerPage,
    register,
    login,
};