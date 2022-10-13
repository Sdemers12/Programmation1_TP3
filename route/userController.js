const User = require("../model/user");
const passport = require("passport");

module.exports = {
    saveUser: (req, res, next) => {
        if (req.skip)
            next();
        let userParams = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };
        const newUser = new User(userParams);
        User.register(newUser, req.body.password, (error, user) => {
            if (error) {
                console.log(error);
                req.flash("error_msg", "Failed to create your account !");
                res.locals.redirect = "/signup";
                next();
            } else {
                req.flash("success_msg", "Account sucessfully created ! Please login.");
                res.locals.redirect = "/login";
                next();
            }
        });
    },

    redirectView: (req, res) => {
        const redirectPath = res.locals.redirect;
        if (redirectPath)
            res.redirect(redirectPath);
    },
    new: (req, res) => {
        res.render("signup", {user: req.user});
    },
    login: (req, res) => {
        res.render("login", {user: req.user});
    },
    isUserAthenticated: (req, res, next) => {
        console.log("isUserAthenticated... Checking if user is authenticated... ");
        if (!req.isAuthenticated()) {
            console.log("isUserAthenticated is not authenticated");
            req.flash("error_msg", "You must be authenticated first.");
            res.redirect("/login");
        } else {
            console.log("isUserAthenticated is authenticated !");
            next();
        }
    }
};