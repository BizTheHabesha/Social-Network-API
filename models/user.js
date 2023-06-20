const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		required: "Username is required",
		trimmed: true,
	},
	email: {
		type: String,
		unique: true,
		required: "Email is required",
		match: [
			/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,
			"Please enter a valid email address",
		],
	},
	thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
	friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

userSchema.virtual("friendCount").get(function () {
	return this.friends.length;
});

const User = model("User", userSchema);

module.exports = { User };
