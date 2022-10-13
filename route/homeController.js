const Product = require("../model/product");
const User = require("../model/user");

exports.getIndex = (req, res) => {
    res.render("new", {user: req.user});
}
exports.getSearch = (req, res) => {
    res.render("search", {
        product: undefined,
        user: req.user
    });
}
exports.redirectIndex = (req, res) => {
    res.redirect("/");
}
exports.getSignup = (req, res) => {
    res.render("signup");
}
exports.getLogin = (req, res) => {
    res.render("login");
}

exports.allProducts = (req, res) => {
    console.log("allProducts... Checking for authentication...");
    if (req.isAuthenticated()) {
        console.log("allProducts is authenticated!");
        Product.find({}).then(product => {
            res.render("index", {
                products: product,
                user: req.user
            });
        }).catch(error => {
            console.log(error);
        });
    } else {
        console.log("allProducts is not authenticated!");
        res.render("index", {
            products: [],
            user: req.user
        });
    }
}

exports.saveProduct = (req, res) => {
    console.log(req.body);
    code = req.body.code;
    description = req.body.description;
    prix = req.body.prix;
    const newProduct = new Product({
        code: code,
        description: description,
        prix: prix
    });
    newProduct.save()
        .then(response => {
            req.flash("success_msg", "Product data added to database successfully !");
            res.redirect("/")
        })
        .catch(error => {
            req.flash("error_msg", "Failed to add your product to the database. Please try again !")
            console.log(error)
        });
}

exports.findOneProduct = (req, res) => {
    const code = req.query.search;
    Product.find({
            code
        })
        .then((product) => {
            if (product.length !== 0) {
                res.render("search", {
                    product,
                    user: req.user
                })
            } else {
                req.flash("error_msg", "Can't find any product matching your query. Please try again !")
                res.redirect('/product/search');
            }
        }).catch(
            error => {
                req.flash("error_msg", "Can't find any product matching your query. Please try again !")
                res.redirect('/product/search');
                console.log(error);
            }
        );
}

exports.editProduct = (req, res) => {
    const searchById = {
        _id: req.params.id
    };
    Product.findById(searchById)
        .then(product => {
            res.render("edit", {
                product: product,
                user: req.user
            })
        }).catch();
}

exports.update = (req, rep) => {
    const searchQuery = {
        _id: req.params.id
    };
    Product.updateOne(searchQuery, {
            $set: {
                code: req.body.code,
                description: req.body.description,
                prix: req.body.prix
            }
        }).then((product) => {
            req.flash("success_msg", "Product data updated successfully !");
            rep.redirect("/");
        })
        .catch(error => {
            req.flash("error_msg", "Failed to update your product from the database. Please try again !")
            rep.redirect("/");
        });
}

exports.delete = (req, rep) => {
    const searchQuery = {
        _id: req.params.id
    };
    Product.deleteOne(searchQuery).then(() => {
        req.flash("success_msg", "Product deleted successfully !");
        rep.redirect("/");
    }).catch(error => {
        req.flash("error_msg", "Failed to delete your product to the database. Please try again !")
        rep.redirect("/");
    });
}