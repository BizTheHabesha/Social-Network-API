const { isValidObjectId } = require("mongoose");
const { Thought, User } = require("../../models");
const { ClogHttp } = require("../../utils/clog");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const clog = new ClogHttp("GET /api/thoughts", true);
	try {
		// find all thoughts
		const findRes = await Thought.find();
		// if the response is empty, return 204
		if (!findRes) {
			clog.httpStatus(204, "There are no thoughts in the database");
			res.status(204);
			return;
		}
		// return 200 and a json containing the data.
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
		// grab the id from the id parameter
		const _id = req.params["id"];
		// check that this id is a valid object id
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		// find the specified thought
		const findRes = await Thought.findById(_id);
		// if it cannot be found, res 404
		if (!findRes) {
			clog.httpStatus(404);
			res.sendStatus(404);
			return;
		}
		// otherwise return 200 and a json containing the data.
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
			return;
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
			return;
		}
		// otherwise res 201 and a json containing all the data
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
		// extract the id from the id parameter
		const _id = req.params["id"];
		// extract the thoughtText from the body via destruct
		const { thoughtText } = req.body;
		// check that this id is a valid object id
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		// find the specified thought
		const findThoughtRes = await Thought.findById(_id);
		// if the thought cannot be found, res 404
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
		// if thought text is not supplied, res 406 and explain
		if (!thoughtText) {
			clog.httpStatus(406, "Expected thoughtText in request body");
			res.status(406).json({
				message: "Expected thoughtText in request body",
			});
			return;
		}
		// update the nesccesary thought
		await Thought.updateOne({ _id }, { thoughtText });
		// get the now updated thought
		const findUpdatedRes = await Thought.findById(_id);
		// res 202 and a json containing the data
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
		// extract the id from the id parameter
		const _id = req.params["id"];
		// check that this id is a valid object id
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		// find the specified thought
		const findThoughtRes = await Thought.findById(_id);
		// if the thought cannot be found, res 404
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
		// delete the specified thought
		const deleteRes = await Thought.deleteOne({ _id });
		// if delete isn't acknowledged, res 503 and explain
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
		// extract the id from the id parameter
		const { id: _id } = req.params;
		// extract the reactionBody and username via destruct from body
		const { reactionBody, username } = req.body;
		// check if id is a valid object id
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		// if reactionBody and username are not provided, res 406 and explain.
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
		// find the specified thought.
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
		// and the reaction to the specified thought and save.
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
		// extract id from paramas
		const { id: _id } = req.params;
		// extract reactionId from body
		const { reactionId } = req.body;
		// check if id is a valid object id
		if (!isValidObjectId(_id)) {
			clog.httpStatus(406, `${_id} is not a valid id`);
			res.status(406).json({ message: `${_id} is not a valid id` });
			return;
		}
		// find the specified thought
		const findRes = await Thought.findById(_id);
		// if thought not found, res 404
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
		// for each reaction
		await findRes.reactions.forEach(async (reaction, index) => {
			// add the index of the reaction if it matches the id we're looking for
			if (String(reaction.reactionId) === String(reactionId)) {
				findReactionRes["found"] = true;
				findReactionRes["index"] = index;
			}
			clog.info(`Comparing ${reactionId} to ${reaction.reactionId}`);
		});
		// if the specified reaction isn't found, res 404
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
		// remove the reaction and save
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
