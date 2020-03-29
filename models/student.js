const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	passport: {
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

module.exports = model('Student', schema);
