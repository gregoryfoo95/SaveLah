# **_SaveLah!_**

# **Project Background**
SaveLah! is a project that manifested out of my current life situation: having to juggle between my HDB BTO Renovation and my Wedding Banquet in 2023 as a young adult in Singapore. It serves as a budget management app for different categories of expenditure I would have to fork out in the coming months. 
# **Project Description**
This project is a traditional Create-Read-Update-Delete (CRUD) Web-App that responds to client requests with a new HTML page. It serves to exercise the skills that were taught from General Assembly's Software Engineering Immersive Course on general full-stack development utilising the MEN stack (MongoDB, Express and NodeJS).

# **Timeframe**

5 Working Days

# **Deployment** 

The app is deployed on <a href="https://tame-ruby-ostrich-robe.cyclic.app">Cyclic</a>.

A development Trello-styled whiteboard for the planning phase can be found <a href="https://github.com/users/gregoryfoo95/projects/1">here.</a>

# **Technologies Utilized**

- HTML
- Javascript
- CSS
- EJS
- Express (Backend)
- MongoDB (Database)
- Git for Version Control
- Mocha and Chai for Unit Testing
- Window Powershell for Command Line Prompt


# **Wireframe Sketch & User Story**
## Wireframe Sketches
### _Initial Dashboard_
<img src = "https://github.com/gregoryfoo95/SaveLah/blob/main/Planning/Initial%20Dashboard.png?raw=true" width="400" height="400" title="Initial Sketch">

### _Initial User Form Example_
<img src = "https://github.com/gregoryfoo95/SaveLah/blob/main/Planning/Form%20Example.png?raw=true" width="400" height="400" title="Initial User Form">

### _Current Dashboard_
<img src = "https://github.com/gregoryfoo95/SaveLah/blob/main/Planning/Dashboard.png?raw=true" width="400" height="400" title="Initial User Form">

## Users' Stories

| As a ...  | I want ...  | Feature
| :-------- |:------------|:---------
| User | to login/register/logout | Authentication (Security)/POST Request
| User | to have a form to fill in registration/login details | Registration/Login Form (Security)/GET Request
| User | to have an overview of all data through visualisations | Overview of Finances/GET Request
| User | to access page with all budget categories | Overview of Categories/GET Request
| User | to add/edit/delete budget categories | POST/PUT/DELETE Requests
| User | to access page with all transactions | Overview of Transactions/GET Request
| User | to add/edit/delete transactions | POST/PUT/DELETE Requests
| Developer | to have different authorisation rights for users | Authorisation
| Developer | to have validation on View, Model and Controller | Input Validation to prevent noSQL/SQL Injections
| Developer | to have unit testing with Mocha and Chai | Ease of Troubleshooting

# **Development Timeline and Approach**


| Achievables | Duration |
| :--- | :----------- |
| View Creation and corresponding EJS, Database Setup | 1.5 Day
| CRUD Functionalities | 1 Day
| Input Validation on View/Model/Controller | 1.5 Day
| API Creation and Data Visualization | 1 Day

## **Model:**
Using the Model-View-Controller approach, the model in this CRUD app exists in the form of a database. The database employed is MongoDB, which is NoSQL in nature. The Entity-Relationship-Diagram (ERD) is shown below for clarity.
### _Entity Relationship Diagram (ERD)_
<img src = "https://github.com/gregoryfoo95/SaveLah/blob/main/Planning/Entity%20Relationship%20Diagram.png?raw=true" width="400" height="400" title="Initial User Form">

There are 3 major schemas in this model: (1) User, (2) Category and (3) Transaction. For **User**, it contains registration information of the user, in which _username_ and a hashed **(BCrypt)** _password_ would be utilised for subsequent login. It also contains a _user_permission_ field, for future development involving the use case of an Administrator/User segregation.  For **Category**, it has a referenced _user_id_ foreign key to allow its information to be populated during queries. A _category_name_ and _budget_ are also provided for the user to identify the type of category and corresponded budget he/she is willing to assign to it. For **Transaction**, it has a referenced _category_id_ foreign key to allow its information to be populated during queries. A _date_ and _amount_ are also provided for the user to fill up his/her transactions throughout his daily activities, which records the date and expenditure.

| Relationships | Type |
| :--- | :----------- |
| User - Category | One-Many
| Category - Transaction | One-Many
| User - Transaction | One-Many

### Security
This deserves a sub-chapter on its own. It is vital to understand the need for **Validation** in all aspects of a full-stack application. For **Model**, this is primarily achieved by adding requirements within the schema of the database. For instance, explicitly declaring that the schema is a _String_ type. More detailed validation on the server would be mentioned in the subsequent chapter.

### _Category Schema_

```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require('joi');

const categorySchema = new Schema(
  {
    category_name: { 
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const schema = Joi.string().min(1).max(30).required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: (props) =>
          `${props.value} is not a valid category name. Must be between 1 and 30 characters.`,
      },
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },

    budget: {
      type: Number,
      required: true,
      validate: {
      validator: function (value) {
        const schema = Joi.number().min(0).required();
        const { error } = schema.validate(value);
          return error ? false : true;
      },
      message: (props) =>
        `${props.value} is not a valid budget amount. Must be greater than or equals to 0.`,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
```

### _Transaction Schema_
```js
const mongoose = require("mongoose");
const Joi = require('joi');
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    category_id: { type: Schema.Types.ObjectId,
                ref: "Category",
                required:true,
    },
    date: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          const schema = Joi.date().required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: props => `${props.value} is not a valid date format!`
      },
      max: new Date()
    },
        
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          const schema = Joi.number().min(0).required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: (props) =>
          `${props.value} is not a valid expenditure amount. Must be greater than or equals to 0.`,
      },
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);

```
### _User Schema_
```js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require('joi');

const userSchema = new Schema(
  {
    username: { 
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function(value) {
          const schema = Joi.string().alphanum().min(1).max(30).required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: props => `${props.value} is not a valid username!`,
      },
    },
    password: { 
      type: String,
      required: true,
      minlength: 8,
      validate: {
        validator: function(value) {
          const schema = Joi.string().min(8).required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: props => `${props.value} is not a valid password!`,
      }
    },
    
    monthly_salary: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
        const schema = Joi.number().min(0).required();
        const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: (props) =>
          `${props.value} is not a valid salary amount. Must be greater than or equals to 0.`,
      },
    },

    gender: {
      type: String,
      required: true,
    },

    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function(value) {
          const schema = Joi.date().required();
          const { error } = schema.validate(value);
          return error ? false : true;
        },
        message: props => `${props.value} is not a valid date format!`
      },
      max: new Date()
    },

    user_permission: {
      type: String,
      required: true,
    }
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
```

## **View:**
The **View** is primarily built using EJS view engines to allow page routing directly from Node.js based on specific requests to the Express back-end server. Separately, it allows computation to be performed in the server and written with the **<% %>** tags in EJS for illustration, without the need to write pure HTML. 

### _Security_
 For **View**, this is primarily achieved using pattern requirements (REGEX) and drop-downs during user input.

**Summary of View pages:**
| View Folder | View Page | Purpose | URL   
| :-------- |:--------|:------- |:-------
| views | home | Front-page for login/registration | /
| views | index | Dashboard afer login | /dashboard
| views/partials | header | Default boiler plate | NA
|          | footer | Default boiler plate | NA
|          | sidebar| Persistent Display of Sidebar for all pages | NA
| views/users | register | Registration Form | /user/register/new
|             | login    | Login Form | /user/login/new
| views/categories | summary | Summary of all categories | /categories/all
|                  | edit | Edit Form of selected category | /categories/:id/edit
| views/transactions| summary | Summary of all transactions | /transactions/all
|                   | edit | Edit Form of selected transaction | /transactions/:id/edit

## **Controller:**
The **Controller** consists of various controllers utilised to handle requests originated from user interactions with the **View**. It processes the requests and performs queries to the database to locate specific data, which subsequently gets returned to the **View** through a response by the controller.

### _Security_
Similarly to **View**, **Validation** is paramount even more so over here! Hackers can infiltrate and amend your View very simply by accessing the _inspect_ feature on your browser and tinker within. Henceforth, the fortress in your View is not that secure after all! NoSQL and SQL injections are potential ways that the hacker can harness to break through our defence. This topic would be further explored in my subsequent General Assembly Project.

As for this project, the server is validated for user requests through the usage of _Mongoose Validation methods_ and _Joi_. Mongoose is a MongoDB object modeller and handler for a Node.js environment and Mongoose Validation is essentially a middleware that is defined within the SchemaType of a Mongoose schema. This will be automatically triggered before a document is saved in MongoDB. Separately, the controllers are also programmed to reject certain conditions in the requests that it encounters, which acts as an additional layer of defence.

| Controllers|Functionality   
| :-------|:-------------------|
| users | _loginPage, registerPage, register, login, logout, isAuth, isAdmin_
| dashboard | _home, dashboard, getData_
| categories | _summary, create, editForm, edit, del_
| transactions | _summary, create, editForm, edit, del_

<details><summary>users</summary>

```js
const User = require("../models/User");
const Category  = require("../models/Category");
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
        const username = await User.find({username: req.body.username}).exec();
        if (req.body.password === req.body.password2 && !username.length) {
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
        } else if (username.length) {
            res.render("users/register", {msg: "Your username has been taken!"});
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
                const categories = await Category.find().exec();
                const [data,catArr,budgetArr,spentArr,deltaArr] = await dashboardCtrl.getData(req);
                res.render("index", {username,user_permission,categories,data,catArr,budgetArr,spentArr,deltaArr,msg:""});
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

module.exports = {
    loginPage,
    registerPage,
    register,
    login,
    logout,
    isAdmin,
    isAuth,
};
```
</details>

<details><summary>dashboard</summary>

```js
const User = require("../models/User");
const Category = require("../models/Category");
const Transaction = require("../models/Transaction");
/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */

const home = async (req, res) => {
    res.render('home', {
        msg: ""
    });
};

const dashboard = async (req, res) => {
    const user_id = req.session.userid;
    const user = await User.findById(user_id);
    const username = user.username;
    const user_permission = user.user_permission;
    const [data,catArr,budgetArr,spentArr,deltaArr] = await getData(req);
    res.render('index', {
        username: username,
        user_permission: user_permission,
        data: data,
        catArr: catArr,
        budgetArr: budgetArr,
        spentArr: spentArr,
        deltaArr: deltaArr,
        msg:"",
    });
};

const getData = async (req) => {
    let transactionArr = [];
    let catArr = [];
    let budgetArr = [];
    let spentArr = [];
    let deltaArr=[];
    let sum = 0;
    const user_id = req.session.userid;
    const categories = await Category.find({user_id:user_id}).exec();
    const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
    categories.forEach((category) => {
        const category_name = category.category_name;
        const budget = category.budget;
        transactionArr.push({category_name: category_name,
                             budget: budget});
    })
    transactionArr.forEach((transactionObj) => {
        transactions.forEach((transaction) => {
            if (transaction.category_id && transaction.category_id.category_name === transactionObj.category_name ) {
                sum += transaction.amount;
            }
        });
        transactionObj["spent"] = sum;
        transactionObj["delta"] = transactionObj.budget - transactionObj.spent;
        catArr.push(transactionObj.category_name);
        budgetArr.push(transactionObj.budget);
        spentArr.push(transactionObj.spent);
        deltaArr.push(transactionObj.delta);
        sum = 0;
    })
    return [transactionArr,catArr,budgetArr,spentArr,deltaArr];
}


module.exports = {
    home,
    dashboard,
    getData,
};
```
</details>

<details><summary>categories</summary>

```js
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
```

</details>

<details><summary>transactions</summary>

```js
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
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
        if (pattern) {
            const Re = new RegExp(pattern.toUpperCase());
            const categories = await Category.find({ user_id: user_id}).exec();
            const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                 match: { 
                    user_id: user_id,
                    category_name: Re,
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
            const categories = await Category.find({user_id:user_id}).exec();
            const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
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
        const user_id = req.session.userid;
        const categories = await Category.find({user_id: user_id}).exec()
        await Transaction.create(
            {
                category_id: req.body.category_id,
                user_id: user_id,
                date: req.body.date,
                amount: req.body.amount,
            });
        const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
        const msg = `You have added a transaction`;
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
        const transaction_id = req.params.id;
        const transaction = await Transaction.findById(transaction_id).populate("category_id").exec();
        const categories = await Category.find({user_id: user_id}).exec();
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
        const id = req.params.id;
        const transaction = await Transaction.findByIdAndUpdate(id, req.body, {new:true}).exec();
        const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
            })
            .exec();
        const categories = await Category.find({user_id: user_id}).exec();
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
        await Transaction.findByIdAndDelete(id).exec();
        const categories = await Category.find({user_id: user_id}).exec();
        const transactions = await Transaction
            .find()
            .populate(
                {path: "category_id",
                match: { user_id: user_id }
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
```
</details>

### _Routers_
Not to forget, our Routers are the mechanism which routes HTTP requests from the **View** to the code **(Controller)** that handles them! Essentially, the router determines what happens when a user interacts with the full-stack app!

| Routers|  
| :-------|
| users | 
| index |
| category |
| transaction |

<details><summary>users</summary>

```js
var express = require('express');
var router = express.Router();
const usersCtrl = require("../controllers/users");
router.get("/login/new", usersCtrl.loginPage);
router.get("/register/new", usersCtrl.registerPage);
router.post("/register", usersCtrl.register);
router.post("/login", usersCtrl.login);
router.delete("/logout", usersCtrl.logout);
module.exports = router;
```
</details>

<details><summary>index</summary>

```js
var express = require('express');
var router = express.Router();
const dashboardCtrl = require("../controllers/dashboard");
const userCtrl = require("../controllers/users");

router.get('/', dashboardCtrl.home);
router.get('/dashboard', userCtrl.isAuth, dashboardCtrl.dashboard);
router.get('/api/data', userCtrl.isAuth, userCtrl.isAdmin, dashboardCtrl.getData);
module.exports = router;

```
</details>

<details><summary>category</summary>

```js
var express = require('express');
var router = express.Router();
const categoryCtrl = require("../controllers/categories");
const userCtrl = require("../controllers/users");

router.get("/all", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.summary);
router.post("/", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.create);
router.get("/:id/edit", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.editForm);
router.put("/:id", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.edit);
router.delete("/:id", userCtrl.isAuth, userCtrl.isAdmin, categoryCtrl.del);

module.exports = router;


```
</details>

<details><summary>transaction</summary>

```js
var express = require('express');
var router = express.Router();
const transactionCtrl = require("../controllers/transactions");
const userCtrl = require("../controllers/users");

router.get("/all", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.summary);
router.post("/", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.create);
router.get("/:id/edit", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.editForm);
router.put("/:id", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.edit);
router.delete("/:id", userCtrl.isAuth, userCtrl.isAdmin, transactionCtrl.del);

module.exports = router;
```
</details>

# **Key Takeaways**
Before the commencement of this app, the original impression of the difficulty in developing a CRUD app was classified as "manageable" by my own standards. That changed when there were many more considerations besides just developing the CRUD features! These considerations include but not limited to: (1) Database Design, essentially ERD! and (2) Validation for View/Model/Controller to prevent NoSQL/SQL injections by hackers. My biggest key takeaway could be succintly mentioned in a sentence: **_Always do your due diligence to plan your Model/View/Controller before coding away!_**

# **Future Works**

- Profile Page for User to amend his registration information
- Sign in with OAuth (Google, Facebook)
- Unit Testing with Mocha and Chai
- Link up with another user to form a Couple entity, joint account with shared categories
- Further enhance CSS Bootstrap styling
- Have a new database schema of "Projects" to contain categories and transactions
- Have a use case for different _user_permission_: User Vs Admin