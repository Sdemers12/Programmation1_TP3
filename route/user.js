const express = require("express");
const router = express.Router();
const homeController = require("./homeController");
const userController = require("./userController");
const passport = require("passport");

router.get("/product/new", userController.isUserAthenticated, homeController.getIndex);
router.post("/product/new", userController.isUserAthenticated, homeController.saveProduct);
router.get("/product/search", userController.isUserAthenticated, homeController.getSearch);
router.get("/product/search/find", userController.isUserAthenticated, homeController.findOneProduct);

router.get("/", homeController.allProducts);
router.get("/index", homeController.redirectIndex);

router.get("/edit/:id", userController.isUserAthenticated, homeController.editProduct);
router.put("/edit/:id", userController.isUserAthenticated, homeController.update);

router.delete("/delete/:id", homeController.delete);

/*-------------------*/
// Signup
router.get("/signup", userController.new, userController.isUserAthenticated); 
router.post("/signup/create", userController.saveUser, userController.redirectView);  

// Signin
router.get("/login", userController.login); 
router.post("/login", 
    passport.authenticate("local", { failureRedirect: "/loginFailed", failureFlash: true }),
    function(req, res) {
        res.redirect("/index");
    });

router.get("/loginFailed", function(req, res){
      req.flash("error_msg", "Authentication failure.");
      res.redirect("/login");    
  });

// Logout
router.get("/logout", userController.isUserAthenticated, (req, res) =>{
    req.logout();
    res.redirect("/login");
});
/*-------------------*/

module.exports = router;