const config = require("../config/config");

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.cookie("valido", false);
    res.clearCookie("id");
    res.render("index", {
        title: config.title,
        header: "Login",
    });
});

module.exports = router;
