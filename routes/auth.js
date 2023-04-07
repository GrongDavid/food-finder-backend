const User = require('../models/user')
const express = require('express')
const router = new express.Router()
const createToken = require('../helpers/token')

router.post('/token', async function (req, res, next) {
	try {
		const { username, password } = req.body
		const user = await User.authenticate(username, password)
		const token = createToken(user)
		return res.json({ token })
	} catch (error) {
		return next(error)
	}
})

router.post('/register', async function (req, res, next) {
	try {
		const registerData = { ...req.body, isAdmin: false }
		const newUser = await User.register(registerData)
		const token = createToken(newUser)
		return res.status(200).json({ token })
	} catch (error) {
		return next(error)
	}
})

module.exports = router
