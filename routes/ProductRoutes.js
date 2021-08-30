const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
const allMiddleware = require("../middleware/AllMiddleware");
const productController = require("../controllers/ProductController");
const { check, validationResult } = require("express-validator");

// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
router.use(bodyParser.json());
// this routes calls a middleware  that runs for every routes which having adminId as parameter
router.param("adminId", allMiddleware.getAdminId);
// route for create new employee
router.post(
	"/product/add/:adminId",
	[
		check(
			"productname",
			"please enter minimum 2 character for  username"
		).isLength({
			min: 2,
		}),

		check("price", "price field can not be empty").notEmpty(),

		check("description", "Description field is mandatory").notEmpty(),
	],
	// allMiddleware.isSignedIn,
	// allMiddleware.isAuthenticated,
	productController.createProduct
);
// route for getting all employees
router.get(
	"/product/:offset/:limit/:adminId",
	allMiddleware.isSignedIn,
	allMiddleware.isAuthenticated,
	productController.getAllProduct
);
// route for delete a employee
router.delete(
	"/product/delete/:productId/:adminId",
	allMiddleware.isSignedIn,
	allMiddleware.isAuthenticated,
	productController.deleteProduct
);
// route for get a specific employee
router.get(
	"/product/:productId/:adminId",
	allMiddleware.isSignedIn,
	allMiddleware.isAuthenticated,
	productController.getAnProduct
);
// route for update an employee
router.put(
	"/product/update/:productId/:adminId",
	allMiddleware.isSignedIn,
	allMiddleware.isAuthenticated,
	productController.updateProduct
);

// search product
router.get(
	"/product/search/any/:searchTerm/:adminId",
	allMiddleware.isSignedIn,
	allMiddleware.isAuthenticated,
	productController.searchProduct
);

module.exports = router;
