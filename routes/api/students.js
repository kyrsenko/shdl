const { Router } = require('express');
const router = Router();
const {
	check,
	validationResult,
} = require('express-validator');

const auth = require('../../middleware/auth');

const Student = require('../../models/Student');

// @route    POST api/students
// @desc     Create student
// @access   Private

router.post(
	'/',
	[
		auth,
		[
			check('name', 'Name is required')
				.not()
				.isEmpty(),
			check(
				'passport',
				'Passport serial is required'
			)
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { name, passport } = req.body;

		const studentFields = {};

		if (name) {
			studentFields.name = name;
		}

		if (passport) {
			studentFields.passport = passport.toUpperCase();
		}

		try {
			let student = await Student.findOne({
				user: req.user.id,
				passport: req.body.passport,
			});

			if (student) {
				return res.status(400).json({
					msg: 'Student already exists',
				});
			}

			student = new Student({
				user: req.user.id,
				...studentFields,
			});

			await student.save();
			res.json(student);
		} catch (error) {
			console.error(error.message);
			res.status(500).json({
				errors: [{ msg: 'Server Error' }],
			});
		}
	}
);

// @route    PUT api/students/:id
// @desc     Edit student
// @access   Private

router.put(
	'/:id',
	[
		auth,
		[
			check('name', 'Name is required')
				.not()
				.isEmpty(),
			check(
				'passport',
				'Passport serial is required'
			)
				.not()
				.isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res
				.status(400)
				.json({ errors: errors.array() });
		}

		const { name, passport } = req.body;

		const studentFields = {};

		if (name) {
			studentFields.name = name;
		}
		if (passport) {
			studentFields.passport = passport.toUpperCase();
		}

		try {
			let student = await Student.findOne({
				user: req.user.id,
				_id: req.params.id,
			});

			if (
				!req.params.id.match(
					/^[0-9a-fA-F]{24}$/
				) ||
				!student
			) {
				return res
					.status(404)
					.json({ msg: 'Student not found' });
			}

			student = await Student.findOneAndUpdate(
				{ user: req.user.id, _id: req.params.id },
				{
					$set: {
						...studentFields,
					},
				},
				{ new: true }
			);

			await student.save();
			res.json(student);
		} catch (error) {
			console.error(error.message);

			if (error.kind === 'ObjectId') {
				return res
					.status(404)
					.json({ msg: 'Student not found' });
			}

			res.status(500).json({
				errors: [{ msg: 'Server Error' }],
			});
		}
	}
);

// @route    GET api/students
// @desc     Get all students of current user
// @access   Private

router.get('/', auth, async (req, res) => {
	try {
		const students = await Student.find({
			user: req.user.id,
		}).populate('user', ['name']);

		if (!students.length) {
			return res.status(404).json({
				errors: [
					{
						msg:
							'There are no students for this company',
					},
				],
			});
		}

		res.json(students);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

// @route    GET api/students/:id
// @desc     Get student by ID
// @access   Private

router.get('/:id', auth, async (req, res) => {
	try {
		const student = await Student.findOne({
			user: req.user.id,
			_id: req.params.id,
		}).populate('user', ['name']);

		// Check for ObjectId format and student
		if (
			!req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
			!student
		) {
			return res
				.status(404)
				.json({ msg: 'Student not found' });
		}

		res.json(student);
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ msg: 'Student not found' });
		}
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

// @route    DELETE api/students/:id
// @desc     Delete student by ID
// @access   Private

router.delete('/:id', auth, async (req, res) => {
	try {
		const student = await Student.findOne({
			user: req.user.id,
			_id: req.params.id,
		});

		// Check for ObjectId format and student
		if (
			!req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
			!student
		) {
			return res
				.status(404)
				.json({ msg: 'Student not found' });
		}

		await student.remove();
		res.json({ msg: 'Student removed' });
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ msg: 'Student not found' });
		}
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

module.exports = router;
