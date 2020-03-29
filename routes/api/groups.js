const { Router } = require('express');
const router = Router();
const {
	check,
	validationResult,
} = require('express-validator');

const auth = require('../../middleware/auth');

const Car = require('../../models/Car');
const Instructor = require('../../models/Instructor');
const Student = require('../../models/Student');
const Group = require('../../models/Group');

// @route    POST api/groups
// @desc     Create group
// @access   Private

router.post(
	'/',
	[
		auth,
		[
			check('name', 'Name is required')
				.not()
				.isEmpty(),
			check('start', 'Start date is required')
				.not()
				.isEmpty(),
			check('end', 'End date is required')
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

		const { name, start, end } = req.body;

		try {
			let group = await Group.findOne({
				user: req.user.id,
				name: req.body.name,
			});

			if (group) {
				return res
					.status(400)
					.json({ msg: 'Group already exists' });
			}

			group = new Group({
				user: req.user.id,
				name,
				start,
				end,
			});

			await group.save();
			res.json(group);
		} catch (error) {
			console.error(error.message);
			res.status(500).json({
				errors: [{ msg: 'Server Error' }],
			});
		}
	}
);

// @route    PUT api/groups/:id
// @desc     Edit group
// @access   Private

router.put(
	'/:id',
	[
		auth,
		[
			check('name', 'Name is required')
				.not()
				.isEmpty(),
			check('start', 'Start date is required')
				.not()
				.isEmpty(),
			check('end', 'End date is required')
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

		const { name, start, end } = req.body;

		const groupFields = {};

		if (name) {
			groupFields.name = name;
		}
		if (start) {
			groupFields.start = start;
		}
		if (end) {
			groupFields.end = end;
		}

		try {
			let group = await Group.findOne({
				user: req.user.id,
				_id: req.params.id,
			});

			if (
				!req.params.id.match(
					/^[0-9a-fA-F]{24}$/
				) ||
				!group
			) {
				return res
					.status(404)
					.json({ msg: 'Group not found' });
			}

			group = await Group.findOneAndUpdate(
				{ user: req.user.id, _id: req.params.id },
				{
					$set: {
						...groupFields,
					},
				},
				{ new: true }
			);

			await group.save();
			res.json(group);
		} catch (error) {
			console.error(error.message);

			if (error.kind === 'ObjectId') {
				return res
					.status(404)
					.json({ msg: 'Group not found' });
			}

			res.status(500).json({
				errors: [{ msg: 'Server Error' }],
			});
		}
	}
);

// @route    GET api/groups
// @desc     Get all groups of current user
// @access   Private

router.get('/', auth, async (req, res) => {
	try {
		const groups = await Group.find({
			user: req.user.id,
		}).populate('user', ['name']);

		if (!groups.length) {
			return res.status(404).json({
				errors: [
					{
						msg:
							'There are no groups for this company',
					},
				],
			});
		}

		res.json(groups);
	} catch (error) {
		console.error(error.message);
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

// @route    GET api/groups/:id
// @desc     Get group by ID
// @access   Private

router.get('/:id', auth, async (req, res) => {
	try {
		const group = await Group.findOne({
			user: req.user.id,
			_id: req.params.id,
		}).populate('user', ['name']);

		// Check for ObjectId format and group
		if (
			!req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
			!group
		) {
			return res
				.status(404)
				.json({ msg: 'Group not found' });
		}

		res.json(group);
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ msg: 'Group not found' });
		}
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

// @route    DELETE api/groups/:id
// @desc     Delete group by ID
// @access   Private

router.delete('/:id', auth, async (req, res) => {
	try {
		const group = await Group.findOne({
			user: req.user.id,
			_id: req.params.id,
		});

		// Check for ObjectId format and group
		if (
			!req.params.id.match(/^[0-9a-fA-F]{24}$/) ||
			!group
		) {
			return res
				.status(404)
				.json({ msg: 'Group not found' });
		}

		await group.remove();
		res.json({ msg: 'Group removed' });
	} catch (error) {
		console.error(error.message);
		if (error.kind === 'ObjectId') {
			return res
				.status(404)
				.json({ msg: 'Group not found' });
		}
		res.status(500).json({
			errors: [{ msg: 'Server Error' }],
		});
	}
});

module.exports = router;
