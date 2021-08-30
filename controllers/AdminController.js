const adminModel = require("../model/Admin");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
var cookieParser = require("cookie-parser");

// function for manager signup
exports.signup = async (req, res) => {
	try {
		// checking if any validation error exist
		const errors = validationResult(req);
		// convert errors into array for better readability
		const err = errors.array().map((data, index) => {
			return data.msg;
		});
		// sending the json response for validation errors
		if (!errors.isEmpty()) {
			return res.status(400).json({ status: "validation error", error: err });
		}
		// getting admin details from frontend
		const adminDetails = req.body;
		//checking email exist before or not
		const { email } = adminDetails;
		const emailExist = await adminModel.findOne({ email: email });
		// send json response for email exist before error
		if (emailExist) {
			return res.status(400).json({
				status: "email exist",
				message: "email already exist",
			});
		}
		// convert the plain password into ecrypted format
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		adminDetails.password = hashedPassword;
		// creating admin model object
		const admin = new adminModel(adminDetails);
		// signup admin details
		const newAdmin = await admin.save();
		// return res.json(newAdmin);
		if (newAdmin) {
			// creating token by jwt
			const token = jwt.sign({ _id: newAdmin._id }, process.env.SECRET);
			// store the token into brower cookie
			res.cookie("token", token, { expire: new Date() + 9999 });
			newAdmin.status = undefined;
			newAdmin.message = undefined;
			// sending the json response after successfully signup
			return res.status(201).json({
				status: "ok",
				message: "New Admin created successfully",
				token: token,
				user: newAdmin,
			});
		}
		// sending the error response if something goes wrong
		else {
			return res.status(400).json({
				status: "error",
				message: "something went wrong,try again later",
			});
		}
	} catch (error) {
		// sending the error response if something goes wrong
		res.json(error);
	}
};
exports.login = async (req, res) => {
	try {
		// checking if any validation error exist
		const errors = validationResult(req);
		// convert errors into array for better readability
		const err = errors.array().map((data, index) => {
			return data.msg;
		});
		// sending the json response for validation errors
		if (!errors.isEmpty()) {
			return res.status(400).json({ status: "validation error", error: err });
		}
		// destructing email and password that come from frontend
		const { email, password } = req.body;
		// checking that admin exist or not by enail
		const adminExist = await adminModel.findOne({ email: email });
		if (adminExist) {
			// checking for password match
			const ispasswordMatched = await bcrypt.compare(
				password,
				adminExist.password
			);
			// if password matched
			if (ispasswordMatched) {
				adminExist.password = undefined;
				// creating token by jwt
				const token = jwt.sign({ _id: adminExist._id }, process.env.SECRET);
				// store the token into brower cookie
				res.cookie("token", token, { expire: new Date() + 9999 });
				// sending the json reponse for successfully login
				return res.status(201).json({
					status: "ok",
					token: token,
					user: adminExist,
				});
			}
			// sending error json response if email and password doeant match
			else {
				return res.status(400).json({
					status: "wrong pair",
					message: "wrong email and password pair",
				});
			}
		}
		// sending error json response if email and password doeant match
		else {
			return res.status(400).json({
				status: "wrong pair",
				message: "wrong email and password pair",
			});
		}
	} catch (error) {
		// sending json response if something went wrong
		return res.status(400).json({
			status: "something went wrong",
			message: "try again later",
		});
	}
};
// function for signput
exports.signout = (req, res) => {
	// clearing cookie from client brower
	res.clearCookie("token");
	// sending response of signout
	res.status(201).json({
		message: "signed out successfully",
	});
};
