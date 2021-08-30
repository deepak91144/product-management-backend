const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
const allMiddleware = require("../middleware/AllMiddleware");
const { check, validationResult } = require("express-validator");
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());

const adminController = require("../controllers/AdminController");
// route for manager registration
router.post(
	"/admin/register",
	[
		check("username", "Name should be minimum two character").isLength({
			min: 2,
		}),
		check("email", "please enter a valid email").isEmail(),
		check("password", "please enter minimum 5 character for password").isLength(
			{ min: 5 }
		),
	],
	adminController.signup
);
// route for Manager login
router.post(
	"/admin/login",
	[
		check("email", "please enter a valid email").isEmail(),
		check("password", "password should not be empty").notEmpty(),
	],
	adminController.login
);
// route for manager signout
router.get("/admin/signout", adminController.signout);
module.exports = router;
