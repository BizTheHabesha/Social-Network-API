/* eslint-disable */
/**
 * @class Clog: Console logger that uses special escape characters to make messages pop out in CLIs
 */
class Clog {
	/**
	 * Console logger that uses special escape characters to make messages pop out in CLIs
	 * @author BizTheHabesha
	 * @param {String} _path
	 * @param {Boolean} _usePathByDeafult Tells clog to use path by default where applicable. Evaluates truthy
	 */
	constructor(_path = "Clog", _usePathByDeafult = false) {
		this.setPath(_path);
		this.usePath = !!_usePathByDeafult;
		this.Colors = {
			Reset: "\x1b[0m",
			Bright: "\x1b[1m",
			Dim: "\x1b[2m",
			Underscore: "\x1b[4m",
			Blink: "\x1b[5m",
			Reverse: "\x1b[7m",
			Hidden: "\x1b[8m",
			black: "\x1b[30m",
			red: "\x1b[31m",
			green: "\x1b[32m",
			yellow: "\x1b[33m",
			blue: "\x1b[34m",
			magenta: "\x1b[35m",
			cyan: "\x1b[36m",
			white: "\x1b[37m",
			BgBlack: "\x1b[40m",
			BgRed: "\x1b[41m",
			BgGreen: "\x1b[42m",
			BgYellow: "\x1b[43m",
			BgBlue: "\x1b[44m",
			BgMagenta: "\x1b[45m",
			BgCyan: "\x1b[46m",
			BgWhite: "\x1b[47m",
		};
	}
	setPath(path) {
		if (typeof path !== "string")
			throw new Error(
				`Clog.setPath() expected parameter _path to type string, recieved type ${typeof path}`
			);
		this.path = path;
	}
	log(message, _usePath = this.usePath) {
		if (!_usePath)
			console.log(
				`${this.Colors["white"]}${message}${this.Colors["Reset"]}`
			);
		else
			console.log(
				`${this.Colors["white"]}${this.path}: ${message}${this.Colors["Reset"]}`
			);
	}
	info(message, _usePath = this.usePath) {
		if (!_usePath)
			console.log(
				`${this.Colors["blue"]}${message}${this.Colors["Reset"]}`
			);
		else
			console.log(
				`${this.Colors["blue"]}${this.path}: ${message}${this.Colors["Reset"]}`
			);
	}
	success(message, _usePath = this.usePath) {
		if (!_usePath)
			console.log(
				`${this.Colors["green"]}${message}${this.Colors["Reset"]}`
			);
		else
			console.log(
				`${this.Colors["green"]}${this.path}: ${message}${this.Colors["Reset"]}`
			);
	}
	warn(message, _usePath = this.usePath) {
		if (!_usePath)
			console.log(
				`${this.Colors["yellow"]}${message}${this.Colors["Reset"]}`
			);
		else
			console.log(
				`${this.Colors["yellow"]}${this.path}: ${message}${this.Colors["Reset"]}`
			);
	}
	error(message, _usePath = this.usePath) {
		if (!_usePath)
			console.log(
				`${this.Colors["red"]}${message}${this.Colors["Reset"]}`
			);
		else
			console.log(
				`${this.Colors["red"]}${this.Colors["Blink"]}${this.Colors["Underscore"]}${this.path}:${this.Colors["Reset"]}${this.Colors["red"]} ${message}${this.Colors["Reset"]}`
			);
	}
	critical(message, _usePath = this.usePath) {
		if (!_usePath)
			console.log(
				`${this.Colors["BgRed"]}${this.Colors["black"]}${message}${this.Colors["Reset"]}`
			);
		else
			console.log(
				`${this.Colors["black"]}${this.Colors["BgRed"]}${this.path}: ${message}${this.Colors["Reset"]}`
			);
	}
}

/**
 * A modified form of clog that can log http statuses passed to it with corresponding messages.
 */
class ClogHttp extends Clog {
	/**
	 *
	 * @param {String} _path
	 * @param {Boolean} _usePathByDeafult Should clog use the path option by default
	 * @param {{Number:{String:String}}} _statusColorOptions Colors for a specifc status classes. Can accept options only for the classes needed.
	 */
	constructor(_path = "Clog", _usePathByDeafult = false) {
		super(_path, _usePathByDeafult);
	}

	statusMessage(status) {
		let $text;
		switch (status) {
			case 100:
				$text = "Continue";
				break;
			case 101:
				$text = "Switching Protocols";
				break;
			case 200:
				$text = "OK";
				break;
			case 201:
				$text = "Created";
				break;
			case 202:
				$text = "Accepted";
				break;
			case 203:
				$text = "Non-Authoritative Information";
				break;
			case 204:
				$text = "No Content";
				break;
			case 205:
				$text = "Reset Content";
				break;
			case 206:
				$text = "Partial Content";
				break;
			case 300:
				$text = "Multiple Choices";
				break;
			case 301:
				$text = "Moved Permanently";
				break;
			case 302:
				$text = "Moved Temporarily";
				break;
			case 303:
				$text = "See Other";
				break;
			case 304:
				$text = "Not Modified";
				break;
			case 305:
				$text = "Use Proxy";
				break;
			case 400:
				$text = "Bad Request";
				break;
			case 401:
				$text = "Unauthorized";
				break;
			case 402:
				$text = "Payment Required";
				break;
			case 403:
				$text = "Forbidden";
				break;
			case 404:
				$text = "Not Found";
				break;
			case 405:
				$text = "Method Not Allowed";
				break;
			case 406:
				$text = "Not Acceptable";
				break;
			case 407:
				$text = "Proxy Authentication Required";
				break;
			case 408:
				$text = "Request Time-out";
				break;
			case 409:
				$text = "Conflict";
				break;
			case 410:
				$text = "Gone";
				break;
			case 411:
				$text = "Length Required";
				break;
			case 412:
				$text = "Precondition Failed";
				break;
			case 413:
				$text = "Request Entity Too Large";
				break;
			case 414:
				$text = "Request-URI Too Large";
				break;
			case 415:
				$text = "Unsupported Media Type";
				break;
			case 499:
				$text = "Client Closed Request";
				break;
			case 500:
				$text = "Internal Server Error";
				break;
			case 501:
				$text = "Not Implemented";
				break;
			case 502:
				$text = "Bad Gateway";
				break;
			case 503:
				$text = "Service Unavailable";
				break;
			case 504:
				$text = "Gateway Time-out";
				break;
			case 505:
				$text = "HTTP Version not supported";
				break;
			default:
				$text = "Unknown status";
				break;
		}
		return $text;
	}
	httpStatus(status, _message) {
		let message = _message ? JSON.stringify(_message, null, 2) : "";
		let sM = this.statusMessage(status);
		let bg, fg, fgA;
		switch (String(status).charAt(0)) {
			case "1":
				bg = "BgWhite";
				fg = "black";
				fgA = "white";
				break;
			case "2":
				bg = "BgGreen";
				fg = "black";
				fgA = "green";
				break;
			case "3":
				bg = "BgYellow";
				fg = "black";
				fgA = "yellow";
				break;
			case "4":
				bg = "BgYellow";
				fg = "black";
				fgA = "yellow";
				break;
			case "5":
				bg = "BgRed";
				fg = "white";
				fgA = "red";
				break;
			default:
				console.log(
					`${this.Colors["BgYellow"]}${this.Colors["black"]} ? ${status} ${this.path} ? ${this.Colors["Reset"]} ${sM}: ${message}`
				);
				break;
		}
		if (bg)
			console.log(
				`${this.Colors[bg]}${this.Colors[fg]} ${status} ${this.Colors["Underscore"]}${this.path}${this.Colors["Reset"]} ${this.Colors[fgA]}${sM}: ${message}${this.Colors["Reset"]}`
			);
	}
	end() {
		console.log(
			`${this.Colors["BgGreen"]}${this.Colors["Blink"]} ! ${this.Colors["Reset"]} endof ${this.path} ${this.Colors["BgGreen"]}${this.Colors["Blink"]} ! ${this.Colors["Reset"]}`
		);
	}
}

/**
 * @deprecated
 * A modified form of clog that can log conflicts and recoomended solutions.
 */
class Arbitrator extends Clog {
	constructor(_path = "Clog", _usePathByDeafult = false) {
		super(_path, _usePathByDeafult);
	}
	/**
	 *
	 * @param {Error} error
	 * @param {string} _severity
	 */
	trace(error, _severity) {
		const severity = _severity ? _severity : "critical";
		switch (severity) {
			case "error":
				this.error(` Error: ${error.name}: ${error.message} `);
				this.error(" Stack trace: ");
				this.error(" Stack trace: ");
				console.log(error.stack);
				this.error(" End Stack Trace ");
				break;

			case "warn":
				this.warn(` Error: ${error.name}: ${error.message} `);
				this.warn(" Stack trace: ");
				console.log(error.stack);
				this.warn(" End Stack Trace ");
				break;

			case "critical":
				this.critical(` Error: ${error.name}: ${error.message} `);
				this.critical(" Stack trace: ");
				console.log(error.stack);
				this.critical(" End Stack Trace ");
				break;

			default:
				this.log(` Error: ${error.name}: ${error.message} `);
				this.log(" Stack trace: ");
				console.log(error.stack);
				this.log(" End Stack Trace ");
				break;
		}
	}
}

class CustomClog extends Clog {
	_runCustom() {}
	constructor(_path = "Clog", _usePathByDeafult = false) {
		super(_path, _usePathByDeafult);
	}
	createCustom(profileName, sections) {
		this[profileName] = function (message, _usePath = false) {
			let path = _usePath ? this.path : "";
			let defsecs = Object.keys(sections);
			console.log(`${path}: SECTIONS: ${defsecs}: MESSAGE: ${message}`);
		};
	}
	custom(profile, message, _usePath = false) {
		let cb = this[profile];
		return cb(message, _usePath);
	}
}

module.exports = { Clog, ClogHttp, Arbitrator, CustomClog };
