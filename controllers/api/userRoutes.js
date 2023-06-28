const { isValidObjectId } = require("mongoose");
const { User } = require("../../models/user");
const { ClogHttp } = require("../../utils/clog");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const clog = new ClogHttp("/api/users", true);
	try {
		const findRes = await User.find();
		if (!findRes) {
			clog.status(204, "Find response returned empty!");
			res.status(204);
			return;
		}
		clog.httpStatus(200, "route not implmented");
		res.status(200).json(findRes);
	} catch (err) {
		clog.error(err.stack);
		clog.httpStatus(500, err.message);
		res.sendStatus(500);
	}
});

router.get("/:id", async (req, res) => {
	const clog = new ClogHttp("/api/users/:id", true);
	try {
		const _id = req.params["id"];
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid ObjectId`);
			res.status(406).json({ message: `${_id} is not a valid ObjectId` });
			return;
		}
		const findRes = await User.findById(_id);
		if (!findRes) {
			clog.httpStatus(404);
			res.sendStatus(404);
		}
		clog.httpStatus(200);
		res.status(200).json(findRes);
	} catch (err) {
		clog.error(err.stack);
		clog.httpStatus(500, err.message);
		res.sendStatus(500);
	}
});

router.post("/", async (req, res) => {
	const clog = new ClogHttp("/api/users/", true);
	try {
		const { username, email } = req.body;
		// check if username and email are provided.
		if (!username || !email) {
			clog.httpStatus(406, "Expected username and email in request body");
			res.status(406).json({
				message: "Expected username and email in request body",
			});
			return;
		}
		// check if username and email are type string
		if (typeof username !== "string" || typeof email !== "string") {
			clog.httpStatus(
				406,
				"Expected username and email to be type string."
			);
			res.status(406).json({
				message: "Expected username and email to be type string.",
			});
			return;
		}
		// check for existing users with that username
		const findUserRes = await User.findOne({ username });
		if (findUserRes) {
			clog.httpStatus(409, `User '${username}' already exists...`);
			res.status(409).json({
				message: `User '${username}' already exists`,
			});
			return;
		}
		const findEmailRes = await User.findOne({ email });
		if (findEmailRes) {
			clog.httpStatus(409, `User with email '${email}' already exists`);
			res.status(409).json({
				message: `User with email '${email}' already exists`,
			});
			return;
		}
		clog.httpStatus(200);
		res.sendStatus(200);
	} catch (err) {
		clog.error(err.stack);
		clog.httpStatus(500, err.message);
		if (!res.headersSent) {
			res.sendStatus(500);
		} else {
			clog.httpStatus(0, "Headers were already sent.");
		}
	}
});

module.exports = router;
