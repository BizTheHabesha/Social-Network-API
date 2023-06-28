const express = require("express");
const db = require("./config/connection");
const routes = require("./controllers");
const { Clog } = require("./utils/clog");
const clog = new Clog("Server", true);

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once("open", () => {
	clog.success(`MongoDB connection open on database ${process.env.DB_NAME}`);
	app.listen(PORT, () => {
		clog.success(`API Server running on port ${PORT}`);
	});
});
