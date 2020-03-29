const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	number: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = model('Car', schema);
