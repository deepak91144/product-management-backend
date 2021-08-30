const mongoose = require("mongoose");
// creating employeemodel schema
const productSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
		},
		productname: {
			type: String,
			require: true,
			trim: true,
		},
		price: {
			type: Number,
			trim: true,
		},

		description: {
			type: String,
			trim: true,
		},
		addedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "admin",
		},
	},
	{ timestamps: true }
);
// creating emmployee model
const Product = new mongoose.model("product", productSchema);
// exporting the model
module.exports = Product;
