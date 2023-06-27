const { User } = require("../../models/user");
const { ClogHttp } = require("../../utils/clog");
const router = require("express").Router();

router.get("/", async (req, res) => {
	const clog = new ClogHttp("/api/users", true);
	try {
		clog.httpStatus(501, "route not implmented");
		res.sendStatus(501);
	} catch (err) {
		clog.httpStatus(500, err.message);
		res.sendStatus(500);
	}
});

module.exports = router;
