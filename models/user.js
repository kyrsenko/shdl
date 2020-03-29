const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now(),
	},
	students: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Student',
		},
	],
	instructors: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Instructor',
		},
	],
	cars: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Car',
		},
	],
	groups: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Group',
		},
	],
});

module.exports = model('User', schema);
