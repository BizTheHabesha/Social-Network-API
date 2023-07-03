const { Schema, model, Types } = require("mongoose");

const reactionSchema = new Schema({
	reactionId: {
		type: Types.ObjectId,
		default: new Types.ObjectId(),
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
		get: (date) => date.toLocaleTimeString(),
	},
});

const thoughtSchema = new Schema(
	{
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
	},
	{
		toJSON: {
			virtuals: true,
		},
		id: false,
	}
);

thoughtSchema.virtual("reactionCount").get(function () {
	return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = { Thought };
