const productModel = require("../model/Product");
const { check, validationResult } = require("express-validator");
var uuid = require("uuid");
// function to add employee
exports.createProduct = async (req, res) => {
	try {
		// fetching arror from express-validator if anyexist
		const errors = validationResult(req);

		// convert error object into array for better readability
		const err = errors.array().map((data, index) => {
			return data.msg;
		});
		// sending json response of errors
		if (!errors.isEmpty()) {
			return res.status(400).json({ status: "validation error", error: err });
		}
		// getting employee details from frontend
		const productDetails = req.body;
		productDetails.id = uuid.v4();
		productDetails.addedBy = req.profile._id;
		// creating object of employee model
		const product = new productModel(productDetails);
		// finally saving product details to db
		const newProduct = await product.save();
		// if new employee is created successfully send the json response back to frontend
		if (newProduct) {
			return res.status(201).json({
				status: "ok",
				message: "NewEmployee created successfully",
				employee: newProduct,
			});
		}
		// else return the error response
		else {
			return res.status(401).json({
				message: "something went wrong, try again later",
			});
		}
	} catch (error) {
		return res.status(401).json({
			message: error,
		});
	}
};
// function to delete employee
exports.deleteProduct = async (req, res) => {
	try {
		// get employeeId from query parameter
		const productId = req.params.productId;

		// delete employee from db
		const deletedProduct = await productModel.findOneAndDelete({
			_id: productId,
		});
		// if employee succssfully deleted send a json request accordingly
		if (deletedProduct) {
			return res.status(203).json({
				message: "employee deleted successfully",
				deletedProduct: deletedProduct,
			});
		}
		// if something went wrong send json response accordingly
		else {
			return res.status(203).json({
				message: "something went wrong try again later",
			});
		}
	} catch (error) {
		// if some thing went wrong caatch block runs
		return res.status(203).json({
			message: "something went wrong try again later",
		});
	}
};
exports.updateProduct = async (req, res) => {
	try {
		// geeting the empid from parameter
		const productId = req.params.productId;
		// geting employee details from frontend
		const productDetails = req.body;
		// updating the employee details into db
		const updatedProduct = await productModel.findOneAndUpdate(
			{
				_id: productId,
			},
			productDetails,
			{ new: true }
		);
		// sending the json response to frontend after successfully updation
		res.json({
			status: "ok",
			message: "product updated successfully",
			data: updatedProduct,
		});
	} catch (error) {
		// sending the error after something went wrong
		res.json({
			message: "something went wrong",
		});
	}
};
exports.searchProduct = async (req, res) => {
	const searchTerm = req.params.searchTerm;

	let regEx = new RegExp(searchTerm, "i");
	const result = await productModel.find({ productname: regEx });
	if (result) {
		return res.status(200).json({
			status: "ok",
			message: "fetched successfully",
			product: result,
		});
	} else {
		return res.status(200).json({
			status: "error",
			message: "something went wrong please try later",
		});
	}
};

// fetching all employee data
exports.getAllProduct = async (req, res) => {
	try {
		const limit = req.params.limit;
		const offset = req.params.offset;

		// getting all the employee from db
		const product = await productModel
			.find()
			.skip(parseInt(offset))
			.limit(parseInt(limit));
		const totalRecord = await productModel.find().count();

		// if data fetched successfully send json response
		if (product) {
			return res.status(200).json({
				status: "ok",
				message: "fetched successfully",
				product: product,
				totalRecord: totalRecord,
			});
		}
		// if something went wrong send json response accordingly
		else {
			return res.status(401).json({
				status: "error",
				message: "something went wrong try again later",
			});
		}
	} catch (error) {
		// if some thing went wrong caatch block runs
		return res.status(401).json({
			status: "error",
			message: "something went wrong try again later",
			error: error,
		});
	}
};

// getting a specific employee

exports.getAnProduct = async (req, res) => {
	try {
		const productId = req.params.productId;
		// getting all the employee from db
		const product = await productModel.findOne({ _id: productId });
		// if data fetched successfully send json response
		if (product) {
			return res.status(200).json({
				message: "fetched successfully",
				product: product,
			});
		}
		// if something went wrong send json response accordingly
		else {
			return res.status(401).json({
				message: "something went wrong try again later",
			});
		}
	} catch (error) {
		// if some thing went wrong caatch block runs
		return res.status(401).json({
			message: "something went wrong try again later",
		});
	}
};
