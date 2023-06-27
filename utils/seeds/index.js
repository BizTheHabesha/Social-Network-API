const connection = require("../../config/connection");
const { User, Thought } = require("../../models");
const userSeeds = require("./user-seeds");
const thoughtSeeds = require("./thought-seeds");
const { Clog } = require("../clog");

connection.on("error", (err) => {
	const clog = new Clog("/utils/seeds => error?", true);
	clog.error(err.message);
});

connection.once("open", async () => {
	const clog = new Clog("/utils/seeds", true);
	clog.success("connection open");

	let userCheck = await connection.db
		.listCollections({ name: "users" })
		.toArray();
	if (userCheck.length) {
		await connection.dropCollection("users");
		clog.info("collection 'users' dropped");
	}

	let thoughtCheck = await connection.db
		.listCollections({ name: "thoughts" })
		.toArray();
	if (thoughtCheck.length) {
		await connection.dropCollection("thoughts");
		clog.info("collection 'thoughts' dropped");
	}

	clog.log("Inserting the following Users");
	clog.info(JSON.stringify(userSeeds, null, "\t"));
	clog.log("Inserting the following Thoughts");
	clog.info(JSON.stringify(thoughtSeeds, null, "\t"));

	await User.collection.insertMany(userSeeds);
	await Thought.collection.insertMany(thoughtSeeds);

	clog.success("connection closed");
	process.exit(0);
	clog.critical("connection couldn't be closed");
});
