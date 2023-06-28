const reactionSeeds = [
	{
		reactionBody: "Cool!",
		username: "BizTheHabesha",
	},
	{
		reactionBody: "Awesome!",
		username: "mstranbrought",
	},
	{
		reactionBody: "Great!",
		username: "levi_a_titan_slayer",
	},
	{
		reactionBody: "Interesting!",
		username: "theDoctor",
	},
];

const generateReactions = (numReactions) => {
	let reactions = [];
	for (let i = 1; i <= numReactions; i++) {
		let thisreaction = Math.floor(Math.random() * reactionSeeds.length);
		reactions.push(reactionSeeds[thisreaction]);
	}
	return reactions;
};

const thoughtSeeds = [
	{
		thoughtText: "Welcome everyone!",
		username: "BizTheHabesha",
		reactions: generateReactions(2),
	},
	{
		thoughtText: "Hey guys! Excited to be here!",
		username: "mstranbrought",
		reactions: generateReactions(1),
	},
	{
		thoughtText: "Just bought a boat.",
		username: "BizTheHabesha",
		reactions: generateReactions(3),
	},
	{
		thoughtText: "The boat blew up...",
		username: "BizTheHabesha",
		reactions: generateReactions(4),
	},
	{
		thoughtText: "God, the survey corps is awesome",
		username: "levi_a_titan_slayer",
		reactions: generateReactions(1),
	},
	{
		thoughtText: "Doctor Who fans?",
		username: "theDoctor",
		reactions: generateReactions(5),
	},
];

module.exports = thoughtSeeds;
