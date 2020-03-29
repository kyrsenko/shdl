const { Router } = require('express');
const router = Router();
const {
	check,
	validationResult,
} = require('express-validator');

const auth = require('../../middleware/auth');

const Instructor = require('../../models/Instructor');

// @route    POST api/instructors
// @desc     Create instructor
// @access   Private

router.post(
	'/',
	[
		auth,
		[
			check('name', 'Name is required')
				.not()
				.isEmpty(),
			check('inn', 'INN  is required')
				.not()
				.isEmpty(),
			check(
				'categories',
				'Categories is required'
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

		const { name, inn, categories } = req.body;

		const instructorFields = {};

		if (name) {
			instructorFields.name = name;
		}

		if (inn) {
			instructorFields.inn = inn.toUpperCase();
		}

		if (categories) {
			instructorFields.categories = categories
				.split(',')
				.map(item => item.trim().toUpperCase());
		}

		try {
			let instructor = await Instructor.findOne({
				user: req.user.id,
				inn: req.body.inn,
			});

			if (instructor) {
				return res.status(400).json({
					msg: 'Instructor already exists',
				});
			}

			instructor = new Instructor({
				user: req.user.id,
				...instructorFields,
			});

			await instructor.save();
			res.json(instructor);
		} catch (error) {
			console.error(error.message);
			res.status(500).json({
				errors: [{ msg: 'Server Error' }],
			});
		}
	}
);

// @route    PUT api/instructors/:id
// @desc     Edit instructor
// @access   Private

router.put(
	'/:id',
	[
		auth,
		[
			check('name', 'Name is required')
				.not()
				.isEmpty(),
			check('inn', 'INN  is required')
				.not()
				.isEmpty(),
			check(
				'categories',
				'Categories is required'
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

		const { name, inn, categories } = req.body;

		const instructorFields = {};

		if (name) {
			instructorFields.name = name;
		}

		if (inn) {
			instructorFields.inn = inn.toUpperCase();
		}

		if (categories) {
			instructorFields.categories = categories
				.split(',')
				.map(item => item.trim().toUpperCase());
		}

		try {
			let instructor = await Instructor.findOne({
				user: req.user.id,
				_id: req.params.id,
			});

			if (
				!req.params.id.match(
					/^[0-9a-fA-F]{24}$/
				) ||
				!instructor
			) {
				return res
					.status(404)
					.json({ msg: 'Instructor not found' });
			}

			instructor = await Instructor.findOneAndUpdate(
				{ user: req.user.id, _id: req.params.id },
				{
					$set: {
						...instructorFields,
					},
				},
				{ new: true }
			);

			await instructor.save();
			res.json(instructor);
		} catch (error) {
			console.error(error.message);

			if (error.kind === 'ObjectId') {
				return res.status(404).json({
					errors: {
						msg: 'Instructor not found',
					},
				});
			}

			res.status(500).json({
				errors: [{ msg: 'Server Error' }],
			});
		}
	}
);

// @route    GET api/instructors
// @desc     Get all instructors of current user
// @access   Private

router.get('/', auth, async (req, res) => {
	try {
		const instructors = await Instructor.find({
			user: req.user.id,
		}).populate('user', ['name']);

		if (!instructors.length) {
			return res.status(404).json({
				errors: [
					{
						msg:
							'There are no instructors for this company',
					},
				],
			});
		}

		res.json(instructors);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

// @route    GET api/instructors/:id
// @desc     Get instructor by ID
// @access   Private

router.get('/:id', auth, async (req, res) => {
	try {
		const instructor = await Instructor.findOne({
			user: req.user.id,
			_id: req.params.id,
		}).populate('user', ['name']);

		// Check for ObjectId format and instructor
		if (
			!req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
			!instructor
		) {
			return res
				.status(404)
				.json({ msg: 'Instructor not found' });
		}

		res.json(instructor);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

// @route    DELETE api/instructors/:id
// @desc     Delete instructor by ID
// @access   Private

router.delete('/:id', auth, async (req, res) => {
	try {
		const instructor = await Instructor.findOne({
			user: req.user.id,
			_id: req.params.id,
		});

		// Check for ObjectId format and instructor
		if (
			!req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
			!instructor
		) {
			return res
				.status(404)
				.json({ msg: 'Instructor not found' });
		}

		await instructor.remove();
		res.json({ msg: 'Instructor removed' });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

module.exports = router;
