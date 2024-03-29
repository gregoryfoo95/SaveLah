const User = require("../models/User");
const dashboardCtrl = require("../controllers/dashboard");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const Couple = require("../models/Couple");
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
        if (req.body.password === req.body.password2 && !user.length && req.body.username.length && req.body.monthly_salary) {
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
            return;
        } else if (req.body.monthly_salary === null || req.body.monthly_salary === "") {
            res.render("users/register", {msg: "Please key in your monthly salary."});
            return;
        } else if (new Date(req.body.dob) > new Date()) {
            res.render("users/register", {msg: "Please key in a date before today."});
            return;
        } else if (!req.body.username.length) {
            res.render("users/register", {msg: "Please do not leave the username field empty."});
            return;
        }
    } catch(error) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessage = Object.values(error.errors).map((err) => err.message).join(', ');
            res.status(400).send(`Validation Error: ${errorMessage}`);
            return;
        } else {
            res.status(500).send('Internal Server Error');
            return;
        }
    }
}

const login = async (req,res) => {
    try {
        const {username,password} = req.body;
        const user = await User.findOne({ username });
        const user_id = user._id;
        if (user===null) {
            const context = {msg: "No user was found"}
            res.render("users/login", context);
            return;
        }
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
        bcrypt.compare(password, user.password, async (err, result) => {
            if (result) {
                req.session.userid = user._id;
                req.session.user_permission = user.user_permission;
                const partner_username = partnerUser.username;
                const user_permission = user.user_permission;
                const [data,catArr,budgetArr,spentArr,deltaArr] = await dashboardCtrl.getData(req);
                res.render("index", {user,username,partner_username,user_permission,data,catArr,budgetArr,spentArr,deltaArr,msg:""});
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
    if (req.session.user_permission === "Admin") { 
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
            
        //experimental from here
        const userMatch = await User.findOne({
            username: req.body.partner_username,
            token: req.body.token
        }).exec(); //find a user with partner username and token
        if (userMatch) { //if search is successful
            if (userMatch.couple_id) { //check if the potential partner has a couple id 
                await User.findByIdAndUpdate(user_id, {
                    couple_id: userMatch.couple_id
                },
                {new:true})
                .exec();
            } else {
            const coupleGroup = await Couple.create({status: 0});
            await Promise.all([
                User.findByIdAndUpdate(user_id, {
                    couple_id: coupleGroup._id
                },
                { new: true })
                .exec(),

                User.findByIdAndUpdate(userMatch._id, {
                    couple_id: coupleGroup._id
                }, 
                {new:true})
                .exec()
                ])
            }
        } else {
            const coupleGroup = await Couple.create({ status: 0 });
            await User.findByIdAndUpdate(user_id, {
                couple_id: coupleGroup._id
            }, {new:true})
            .exec();
        }


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