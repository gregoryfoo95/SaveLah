const User = require("../models/User");
const dashboardCtrl = require("../controllers/dashboard");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");

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
        const user = await User.find({username: req.body.username}).exec();
        if (req.body.password === req.body.password2 && !user.length) {
            bcrypt.hash(req.body.password, saltRounds, async (err,hash) => {
            await User.create(
                { username: req.body.username,
                password: hash,
                monthly_salary: req.body.monthly_salary,
                gender: req.body.gender,
                dob: req.body.dob,
                user_permission:req.body.user_permission
                });
            res.redirect("/user/login/new");
        });
        } else if (req.body.password !== req.body.password2) {
            res.render("users/register", {msg: "Your passwords do not match."});
            return;
        } else if (user.length) {
            res.render("users/register", {msg: "Your username has been taken!"});
        } else if (!user.monthly_salary) {
            res.render("users/register", {msg: "Please key in your monthly salary."});
            return;
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

const login = async (req,res) => {
    const {username,password} = req.body;
    const user = await User.findOne({ username })
    try {
        if (user===null) {
            const context = {msg: "No user was found"}
            res.render("users/login", context);
            return;
        }
        bcrypt.compare(password, user.password, async (err, result) => {
            if (result) {
                req.session.userid = user._id;
                req.session.user_permission = user.user_permission;
                const user_permission = user.user_permission;
                const [data,catArr,budgetArr,spentArr,deltaArr] = await dashboardCtrl.getData(req);
                res.render("index", {user,username,user_permission,data,catArr,budgetArr,spentArr,deltaArr,msg:""});
            } else {
                const context = { msg: "Password is wrong" };
                res.render("users/login", context);
            }
        });
    } catch(error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
}

const logout = async (req,res) => {
    try {
        if (req.session) {
            req.session.destroy();
            const context = {msg: "You have been logged out."};
            res.render("home", context);
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

const isAuth = async (req, res, next) => {
    try {
        if (req.session.userid) {
            const user = await User.findById(req.session.userid).exec();
            res.locals.user = user;
            next();
        } else {
            res.render("users/login", {
                msg: "You do not have authorisation to access this page.",
            });
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
        } else {
            res.status(500).send('Internal Server Error');
        }
    }
};

const isAdmin = async (req,res,next) => {
    try {
    if (req.session.user_permission === "Admin") { //remember to add into other codes
        return next();
    } else {
        const user = await User.findById(req.session.userid).exec();
        const username = user.username;
        const user_permission = user.user_permission;
        const [data,catArr,budgetArr,spentArr,deltaArr] = await dashboardCtrl.getData(req);
        const msg = "You do not have authorisation to access this page.";
        res.render("index", {msg, username, user_permission, data,catArr,budgetArr,spentArr,deltaArr});
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

const profilePage = async (req,res) => {
    const user_id = req.session.userid;
    const user = await User.findById(user_id).exec();
    const context = {
        msg: "",
        user: user,
    };
    res.render("users/profile",context);
}

const updateProfile = async (req,res) => {
    try {
        const user_id = req.session.userid;
        let user = await User.findById(user_id).exec();
        let newPassword;
        if (req.body.new_password && req.body.current_password) {
            const isPasswordMatch = await bcrypt.compare(req.body.current_password, user.password);
            if (isPasswordMatch) {
                newPassword = await bcrypt.hash(req.body.new_password, saltRounds);
                await User.findByIdAndUpdate(user_id, {
                    password: newPassword,      
                },
                {new:true})
                .exec();
            }
        } else {
           newPassword = user.password;
        }
        await User.findByIdAndUpdate(user_id, {
                monthly_salary: req.body.monthly_salary,
                gender: req.body.gender,
                dob: req.body.dob,
                user_permission: req.body.user_permission,
                partner_username: req.body.partner_username,
                token: req.body.token,        
            },
            {new:true})
            .exec();
        const [data,catArr,budgetArr,spentArr,deltaArr] = await dashboardCtrl.getData(req);
        user = await User.findById(user_id).exec();
        res.render('index', {
            user: user,
            username: user.username,
            user_permission: user.user_permission,
            data: data,
            catArr: catArr,
            budgetArr: budgetArr,
            spentArr: spentArr,
            deltaArr: deltaArr,
            msg:"You have updated your profile.",
        })
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
    loginPage,
    registerPage,
    register,
    login,
    logout,
    isAdmin,
    isAuth,
    profilePage,
    updateProfile
};