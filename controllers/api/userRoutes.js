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
		clog.log(JSON.stringify(findRes, null, "\t"));
		clog.httpStatus(200, "route not implmented");
		res.status(200).json(findRes);
	} catch (err) {
		clog.httpStatus(500, err.message);
		clog.error(err.stack);
		res.sendStatus(500);
	}
});

router.get("/:id", async (req, res) => {
	const clog = new ClogHttp("/api/users/:id", true);
	try {
		const id = req.params["id"];
		const findRes = await User.findById(id);
		if (!findRes) {
			clog.httpStatus(404);
			res.sendStatus(404);
		}
		clog.log(JSON.stringify(findRes, null, "\t"));
		clog.httpStatus(200);
		res.status(200).json(findRes);
	} catch (err) {
		clog.httpStatus(500, err.message);
		clog.error(err.stack);
		res.sendStatus(500);
	}
});

module.exports = router;
