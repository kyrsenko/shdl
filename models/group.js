const { Schema, model } = require('mongoose');

const schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	start: {
		type: Date,
		default: Date.now(),
	},
	end: {
		type: Date,
		default: Date.now(),
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
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
	shedule: [
		{
			student: {
				type: Schema.Types.ObjectId,
				ref: 'Student',
			},
			instructor: {
				type: Schema.Types.ObjectId,
				ref: 'Instructor',
			},
			process: {
				in: {
					type: Number,
					default: 7,
				},
				out: {
					type: Number,
					default: 32,
				},
				trailer: {
					type: Number,
					default: 9,
				},
			},
			date: {
				type: Date,
			},
		},
	],
	date: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = model('Group', schema);
