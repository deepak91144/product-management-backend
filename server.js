const express = require("express");
const app = express();
var cors = require("cors");
// resolving the cors issues
app.use(cors());
// ncluding .env dependency
require("dotenv").config();
// incuding database connection
require("./model/DbConn");
const AdminRoutes = require("./routes/AdminRoutes");
const ProductRoutes = require("./routes/ProductRoutes");
//including manager route
app.use("/api", AdminRoutes);
// including employee route
app.use("/api", ProductRoutes);

// if any unauthorized person trying to hit any routes this error response is being sent
app.use(function (err, req, res, next) {
	if (err.name === "UnauthorizedError") {
		console.log(err);
		res.status(401).json(err);
	}
});
// defining the PORT
const port = 5000;
app.listen(port, () => console.log(`Example app listening on port port!`));
