const express = require('express')
const User = require('../models/user')
const router = express.Router()
const {
	ensureAdmin,
	ensureLoggedIn,
	ensureCorrectUserOrAdmin,
} = require('../middleware/auth')
//TODO error handling
const createToken = require('../helpers/token')

router.post('/', ensureAdmin, async function (req, res, next) {
	try {
		//validate JSONSchema
		// let validator
		// if (!validator.valid) {
		// 	const errors = validator.errors.map((error) => error.stack)
		// 	//throw error
		// }
		console.log(req.body)
		const user = await User.register(req.body)
		const token = createToken(user)
		return res.status(201).json({ user, token })
	} catch (error) {
		return next(error)
	}
})

router.get('/', ensureAdmin, async function (req, res, next) {
	try {
		const users = await User.getAll()
		return res.json({ users })
	} catch (error) {
		return next(error)
	}
})

router.get('/:username', async function (req, res, next) {
	try {
		const user = await User.get(req.params.username)
		return res.json({ user })
	} catch (error) {
		return next(error)
	}
})

// router.patch(
// 	'/:username',
// 	ensureCorrectUserOrAdmin,
// 	async function (req, res, next) {
// 		try {
// 			//validator, should be const. let until implementation
// 			let validator
// 			if (!validator.valid) {
// 				const errors = validator.errors.map((error) => error.stack)
// 				//throw error
// 			}
// 			//update not yet implemented
// 			const user = await User.update(req.params.username, req.body)
// 			return res.json({ user })
// 		} catch (error) {
// 			return next(error)
// 		}
// 	}
// )

router.delete(
	'/:username',
	ensureCorrectUserOrAdmin,
	async function (req, res, next) {
		try {
			await User.remove(req.params.username)
			return res.json({ deleted: req.params.username })
		} catch (error) {
			return next(error)
		}
	}
)

module.exports = router
