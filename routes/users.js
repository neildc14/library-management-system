var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var crypto = require("crypto");
var session = require("express-session");
var user_controller = require("../controllers/userController");
//login
router.get("/login", user_controller.login_get);
router.post("/login", user_controller.login_post);

//register
router.get("/register", user_controller.register_get);
router.post("/register", user_controller.register_post);

module.exports = router;
