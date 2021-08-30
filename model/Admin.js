const mongoose = require("mongoose");
// creating ManageraSchema
const adminSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			require: true,
			trim: true,
		},
		email: {
			type: String,
			require: true,
			trim: true,
			unique: true,
		},

		password: {
			type: String,
			require: true,
			trim: true,
		},
	},
	{ timestamps: true }
);
// creating Manager Model
const Admin = new mongoose.model("admin", adminSchema);
// exporting the model
module.exports = Admin;
