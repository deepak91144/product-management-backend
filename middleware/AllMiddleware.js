var expressJwt = require("express-jwt");
const adminModel = require("../model/Admin");

// checking the Authenticity of jwt token
exports.isSignedIn = expressJwt({
	secret: process.env.SECRET,
	userProperty: "auth",
	algorithms: ["sha1", "RS256", "HS256"],
});

// getting manager details by id and set maanager data to profile object
exports.getAdminId = async (req, res, next, addminId) => {
	try {
		// get specific manager data by id
		const admin = await adminModel.findById(addminId);

		// if manager found by this id save manager details to req.profile object
		if (admin) {
			req.profile = admin;
		}
		// else send error response
		else {
			return res.status(401).json({
				status: "user not found",
				message: "no user found",
			});
		}
		next();
	} catch (error) {
		return res.status(401).json({
			status: "user not found",
			message: "no  user found",
		});
	}
};

// check if requesting user and logged user is same or not
exports.isAuthenticated = (req, res, next) => {
	let checker = req.profile && req.auth && req.profile._id == req.auth._id;
	// if requesting user and logged user is not same  send access denide response
	if (!checker) {
		return res.status(403).json({
			error: "Access Denide",
		});
	}
	next();
};
