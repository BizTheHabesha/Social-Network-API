const { isValidObjectId } = require("mongoose");
const { User } = require("../../models/");
const { ClogHttp } = require("../../utils/clog");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /api/users", true);
	try {
		const findRes = await User.find();
		if (!findRes) {
			clog.status(204, "Find response returned empty!");
			res.status(204);
			return;
		}
		clog.httpStatus(200);
		res.status(200).json(findRes);
	} catch (err) {
		clog.error(err.stack);
		clog.httpStatus(500, err.message);
		res.sendStatus(500);
	}
});

router.get("/:id", async (req, res) => {
	const clog = new ClogHttp("GET /api/users/:id", true);
	try {
		const _id = req.params["id"];
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		const findRes = await User.findById(_id);
		if (!findRes) {
			clog.httpStatus(404);
			res.sendStatus(404);
			return;
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
	const clog = new ClogHttp("POST /api/users/", true);
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
		const createRes = await User.create({ username, email });
		if (!createRes) {
			clog.error("Creation failed");
			clog.httpStatus(
				503,
				"Mongoose is unavailable or otherwise cannot create documents"
			);
			res.status(503).json({
				message:
					"Mongoose is unavailable or otherwise cannot create documents",
			});
			return;
		}
		clog.httpStatus(202);
		res.status(202).json(createRes);
	} catch (err) {
		if (err.name === "ValidationError") {
			let errors = {};

			Object.keys(err.errors).forEach((key) => {
				errors[key] = err.errors[key].message;
			});

			clog.httpStatus(400, "Validation Error");
			res.status(400).send(errors);
			return;
		} else {
			clog.error(err.stack);
			clog.httpStatus(500, err.message);
			if (!res.headersSent) {
				res.sendStatus(500);
			} else {
				clog.httpStatus(0, "Headers were already sent.");
			}
		}
	}
});

router.put("/:id", async (req, res) => {
	const clog = new ClogHttp("PUT /api/users/:id", true);
	try {
		const _id = req.params["id"];
		const { username, email } = req.body;
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		const findUserRes = await User.findById(_id);
		if (!findUserRes) {
			clog.httpStatus(
				404,
				`'${_id}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `'${_id}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		if (!username && !email) {
			clog.httpStatus(406, "Expected username or email in request body");
			res.status(406).json({
				message: "Expected username or email in request body",
			});
			return;
		}
		const findExistingUserRes = await User.findOne({ username });
		if (findExistingUserRes) {
			clog.httpStatus(409, `User '${username}' already exists.`);
			res.status(409).json({
				message: `User '${username}' already exists.`,
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
		const update = {};
		if (username) update["username"] = username;
		if (email) update["email"] = email;
		await User.updateOne({ _id }, update, {
			new: true,
		});
		const findUpdatedRes = await User.findById(_id);
		clog.httpStatus(202);
		res.status(202).json(findUpdatedRes);
	} catch (err) {
		if (err.name === "ValidationError") {
			let errors = {};

			Object.keys(err.errors).forEach((key) => {
				errors[key] = err.errors[key].message;
			});

			clog.httpStatus(400, "Validation Error");
			res.status(400).send(errors);
			return;
		} else {
			clog.error(err.stack);
			clog.httpStatus(500, err.message);
			if (!res.headersSent) {
				res.sendStatus(500);
			} else {
				clog.httpStatus(0, "Headers were already sent.");
			}
		}
	}
});

router.delete("/:id", async (req, res) => {
	const clog = new ClogHttp("DELETE /api/users/:id", true);
	try {
		const _id = req.params["id"];
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		const findUserRes = await User.findById(_id);
		if (!findUserRes) {
			clog.httpStatus(
				404,
				`'${_id}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `'${_id}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		const deleteRes = await User.deleteOne({ _id });
		if (deleteRes.acknowledged) {
			clog.httpStatus(200);
			res.status(200).json(findUserRes);
		} else {
			clog.httpStatus(9503, "Mongoose is unavailable?");
			res.status(503).json({
				message:
					"Mongoose is unavailable or could not otherwise not complete the request",
			});
		}
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

router.post("/:userId/friends/:friendId", async (req, res) => {
	const clog = new ClogHttp(
		"POST /api/users/:userId/friends/:friendId",
		true
	);
	try {
		const userId = req.params["userId"];
		const friendId = req.params["friendId"];
		if (!isValidObjectId(userId)) {
			clog.httpStatus(406, `userId '${userId}' is not a valid id`);
			res.status(406).json({
				message: `userId '${userId}' is not a valid id`,
			});
			return;
		}
		if (!isValidObjectId(friendId)) {
			clog.httpStatus(406, `friendId '${friendId}' is not a valid id`);
			res.status(406).json({
				message: `friendId '${friendId}' is not a valid id`,
			});
			return;
		}
		const findUserRes = await User.findById(userId);
		if (!findUserRes) {
			clog.httpStatus(
				404,
				`userId '${userId}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `userId '${userId}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		const findFriendRes = await User.findById(friendId);
		if (!findFriendRes) {
			clog.httpStatus(
				404,
				`friendId '${friendId}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `friendId '${friendId}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		if (findUserRes.friends.includes(friendId)) {
			clog.httpStatus(409, `friendId '${friendId}' is already a friend`);
			res.status(409).json({
				message: `friendId '${friendId}' is already a friend`,
			});
			return;
		}
		findUserRes.friends.push(friendId);
		const saveRes = await findUserRes.save();
		if (!saveRes) {
			clog.error("Update failed");
			clog.httpStatus(
				503,
				"Mongoose is unavailable or otherwise cannot update documents"
			);
			res.status(503).json({
				message:
					"Mongoose is unavailable or otherwise cannot update documents",
			});
			return;
		}
		clog.httpStatus(202);
		res.status(202).json({ friends: findUserRes.friends });
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

router.delete("/:userId/friends/:friendId", async (req, res) => {
	const clog = new ClogHttp(
		"DELETE /api/users/:userId/friends/:friendId",
		true
	);
	try {
		const userId = req.params["userId"];
		const friendId = req.params["friendId"];
		if (!isValidObjectId(userId)) {
			clog.httpStatus(406, `userId '${userId}' is not a valid id`);
			res.status(406).json({
				message: `userId '${userId}' is not a valid id`,
			});
			return;
		}
		if (!isValidObjectId(friendId)) {
			clog.httpStatus(406, `friendId '${friendId}' is not a valid id`);
			res.status(406).json({
				message: `friendId '${friendId}' is not a valid id`,
			});
			return;
		}
		const findUserRes = await User.findById(userId);
		if (!findUserRes) {
			clog.httpStatus(
				404,
				`userId '${userId}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `userId '${userId}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		const findFriendRes = await User.findById(friendId);
		if (!findFriendRes) {
			clog.httpStatus(
				404,
				`friendId '${friendId}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `friendId '${friendId}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		const friendIndex = findUserRes.friends.indexOf(friendId);
		if (friendIndex < 0) {
			clog.httpStatus(400, `friendId '${friendId}' is not a friend`);
			res.status(400).json({
				message: `friendId '${friendId}' is not a friend`,
			});
			return;
		}
		findUserRes.friends.splice(friendIndex, 1);
		const saveRes = await findUserRes.save();
		if (!saveRes) {
			clog.error("Update failed");
			clog.httpStatus(
				503,
				"Mongoose is unavailable or otherwise cannot update documents"
			);
			res.status(503).json({
				message:
					"Mongoose is unavailable or otherwise cannot update documents",
			});
			return;
		}
		clog.httpStatus(202);
		res.status(202).json({ friends: findUserRes.friends });
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
