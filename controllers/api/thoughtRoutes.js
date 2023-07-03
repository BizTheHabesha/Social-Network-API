const { isValidObjectId } = require("mongoose");
const { Thought, User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /api/thoughts", true);
	try {
		const findRes = await Thought.find();
		if (!findRes) {
			clog.httpStatus(204, "Find response returned empty!");
			res.status(204);
			return;
		}
		clog.httpStatus(200);
		res.status(200).json(findRes);
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

router.get("/:id", async (req, res) => {
	const clog = new ClogHttp("GET /api/thoughts/:id", true);
	try {
		const _id = req.params["id"];
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		const findRes = await Thought.findById(_id);
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
		if (!res.headersSent) {
			res.sendStatus(500);
		} else {
			clog.httpStatus(0, "Headers were already sent.");
		}
	}
});

router.post("/", async (req, res) => {
	const clog = new ClogHttp("POST /api/thoughts/", true);
	try {
		// extract parameters from body
		const { thoughtText, username } = req.body;
		// check that the nescessary parameters are provided
		if (!thoughtText || !username) {
			clog.httpStatus(
				406,
				"Expected username and thoughtText in request body"
			);
			res.status(406).json({
				message: "Expected username and thoughtText in request body",
			});
			return;
		}
		// find the user from the request
		const findRes = await User.findOne({ username });
		// check the user was found
		if (!findRes) {
			clog.httpStatus(
				404,
				`User '${username}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `User '${username}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		// creat the new thought
		const createRes = await Thought.create({ thoughtText, username });
		// check that the thought was created
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
		}
		// add the thought ID to the user's thoughts array
		findRes.thoughts.push(createRes._id);
		// save the now updated user
		const saveRes = await findRes.save();
		// check that the user was saved succesfully
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
		}
		clog.httpStatus(201);
		res.status(201).json(createRes);
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

router.put("/:id", async (req, res) => {
	const clog = new ClogHttp("PUT /api/thoughts/:id", true);
	try {
		const _id = req.params["id"];
		const { thoughtText } = req.body;
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		const findThoughtRes = await Thought.findById(_id);
		if (!findThoughtRes) {
			clog.httpStatus(
				404,
				`'${_id}' does not exist or could otherwise not be found`
			);
			res.status(404).json({
				message: `'${_id}' does not exist or could otherwise not be found`,
			});
			return;
		}
		if (!thoughtText) {
			clog.httpStatus(406, "Expected thoughtText in request body");
			res.status(406).json({
				message: "Expected thoughtText in request body",
			});
			return;
		}
		await Thought.updateOne({ _id }, { thoughtText });
		const findUpdatedRes = await Thought.findById(_id);
		clog.httpStatus(202);
		res.status(202).json(findUpdatedRes);
	} catch (err) {
		clog.error(err.stack);
		clog.httpStatus(500, err.message);
		res.sendStatus(500);
	}
});

router.delete("/:id", async (req, res) => {
	const clog = new ClogHttp("DELETE /api/thoughts/:id", true);
	try {
		const _id = req.params["id"];
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		const findThoughtRes = await Thought.findById(_id);
		if (!findThoughtRes) {
			clog.httpStatus(
				404,
				`'${_id}' does not exist or could otherwise not be found`
			);
			res.status(404).json({
				message: `'${_id}' does not exist or could otherwise not be found`,
			});
			return;
		}
		const deleteRes = await Thought.deleteOne({ _id });
		if (!deleteRes.acknowledged) {
			clog.httpStatus(9503, "Mongoose is unavailable?");
			res.status(503).json({
				message:
					"Mongoose is unavailable or could not otherwise not complete the request",
			});
			return;
		}
		clog.httpStatus(200);
		res.status(200).json(findThoughtRes);
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

router.post("/:id/reactions", async (req, res) => {
	const clog = new ClogHttp("POST /api/thoughts/:id/reactions", true);
	try {
		const { id: _id } = req.params;
		const { reactionBody, username } = req.body;
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		if (!reactionBody || !username) {
			clog.httpStatus(
				406,
				"Expected reactionBody and username in request"
			);
			res.status(406).json({
				message: "Expected reactionBody and username in request",
			});
			return;
		}
		const findRes = await Thought.findById(_id);
		if (!findRes) {
			clog.httpStatus(
				404,
				`Thought with ID '${_id}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `Thought with ID '${_id}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		await findRes.reactions.push({
			reactionBody,
			username,
		});
		const saveRes = await findRes.save();
		clog.httpStatus(200);
		res.status(200).json(saveRes);
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
router.delete("/:id/reactions", async (req, res) => {
	const clog = new ClogHttp("DELETE /api/thoughts/:id/reactions", true);
	try {
		const { id: _id } = req.params;
		const { reactionId } = req.body;
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		const findRes = await Thought.findById(_id);
		if (!findRes) {
			clog.httpStatus(
				404,
				`Thought with ID '${_id}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `Thought with ID '${_id}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		let findReactionRes = {};
		clog.info(findRes.reactions.length);
		await findRes.reactions.forEach(async (reaction, index) => {
			if (String(reaction.reactionId) === String(reactionId)) {
				findReactionRes["found"] = true;
				findReactionRes["index"] = index;
			}
			clog.info(`Comparing ${reactionId} to ${reaction.reactionId}`);
		});
		if (!findReactionRes.found) {
			clog.httpStatus(
				404,
				`Reaction with ID '${reactionId}' does not exist or could otherwise not be found!`
			);
			res.status(404).json({
				message: `Reaction with ID '${reactionId}' does not exist or could otherwise not be found!`,
			});
			return;
		}
		await findRes.reactions.splice(findReactionRes.index, 1);
		const saveRes = await findRes.save();
		clog.httpStatus(202);
		res.status(202).json(saveRes);
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
