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

router.post('/', async function (req, res, next) {
	try {
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

router.patch('/:username', async function (req, res, next) {
	try {
		const user = await User.update(req.params.username, req.body)
		return res.json({ user })
	} catch (err) {
		return next(err)
	}
})

router.delete('/:username', async function (req, res, next) {
	try {
		await User.remove(req.params.username)
		return res.json({ deleted: req.params.username })
	} catch (error) {
		return next(error)
	}
})

module.exports = router
