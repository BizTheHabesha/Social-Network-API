const { Schema, model } = require("mongoose");

const reactionSchema = new Schema({
	reactionId: {
		type: Schema.Types.ObjectId,
		default: new Schema.Types.ObjectId(),
	},
	reactionBody: {
		type: String,
		required: "Reaction body is required",
		minlength: 1,
		maxlength: 280,
	},
	username: {
		type: String,
		required: "Author required as username",
	},
	createdAt: {
		type: Date,
		default: new Date(),
		get: (date) => date.toDateString(),
	},
});

const thoughtSchema = new Schema({
	thoughtText: {
		type: String,
		required: "Thought text is required",
		minlength: 1,
		maxlength: 280,
	},
	createdAt: {
		type: Date,
		default: new Date(),
		get: (date) => date.toDateString(),
	},
	username: {
		type: String,
		required: "Author required as username",
	},
	reactions: [reactionSchema],
});

thoughtSchema.virtual("reactionCount").get(function () {
	return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = { Thought };
