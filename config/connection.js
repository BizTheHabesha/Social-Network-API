const { connect, connection } = require("mongoose");
require("dotenv").config();
const { Clog } = require("../utils/clog");

const connectionString =
	process.env.MONGODB_URI ||
	`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

connect(connectionString);
const clog = new Clog(connectionString, false);
clog.info("connecting...");

module.exports = connection;
