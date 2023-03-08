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
        console.log(req.body);
        if (req.body.password === req.body.password2) {
            const user = await User.create(
                { username: req.body.username,
                password: req.body.password,
                monthly_salary: req.body.monthly_salary,
                gender: req.body.gender,
                dob: req.body.dob,
                });
            res.send(user);
        } else {
            res.render("users/register", {msg: "Your passwords do not match"});
            return;
        }
    } catch(err) {
            res.send(404, "Error creating user");
        }
    
}

module.exports = {
    loginPage,
    registerPage,
    register
};