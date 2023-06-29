const { isValidObjectId } = require("mongoose");
const { Thought } = require("../../models");
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
		res.sendStatus(500);
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
		}
		clog.httpStatus(200);
		res.status(200).json(findRes);
	} catch (err) {
		clog.error(err.stack);
		clog.httpStatus(500, err.message);
		res.sendStatus(500);
	}
});

module.exports = router;
