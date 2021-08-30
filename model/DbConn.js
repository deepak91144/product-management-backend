const mongoose = require("mongoose");
// connecting express to mongodb
mongoose
	.connect(process.env.DATABASE, { useNewUrlParser: true })
	.then((conn) => {
		console.log("db connected");
	})
	.catch((error) => {
		console.log(error);
	});
