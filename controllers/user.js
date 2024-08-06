const User = require("../models/user");

////// ] creating controllers for routes of Users

// render signup form
module.exports.renderSignup = (req, res)=> {
    res.render("./users/signup.ejs");
};

// signup
module.exports.signup = async(req, res)=> {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({email, username});
        // static method register() of model-"User" to save userinfo in DB.
        let signedUser = await User.register(newUser, password);
        // method=> register(user, password, callback);
        // register method will automatically check if username is unique or not.

        // we use req.login() to automatically login user after signup.
        // passport method to login, takes a userInfo to login and callback as argument.
        req.login(signedUser, (err)=>{
            if(err) return next;
            req.flash("success", "Welcome to Rest&Relax");
            res.redirect("/listing");
        })

    } catch(e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

// render Login form
module.exports.renderLogin= (req, res)=>{
    res.render("./users/login.ejs");
};

// post login handeling
module.exports.login = async(req, res)=> {
    req.flash("success", "Login Successful, Welcome to Rest&Relax");
    // if using locals outside ejs, we need to use res.locals.<variable>
    let redirectUrl = res.locals.redirectUrl || "/listing";
    // will redirect to /listing if locals variable is undefined.
    res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res, next) => {
    // passport method to logout, it takes a callback as argument.
    // // if any error occured while logging out, it will we catched.
    req.logout((err) => {
        if(err) return next(err);

        // must be included inside logout callback function.
        req.flash("success", "You are Logged Out!");
        res.redirect("/listing"); 
    })
};