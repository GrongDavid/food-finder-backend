'use strict'

const express = require('express')
const cors = require('cors')

const app = express()

const { NotFoundError } = require('./expressError')

const { authenticateJWT } = require('./middleware/auth')
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/users')

app.use(express.json())
app.use(cors())
app.use(authenticateJWT)

app.use('/auth', authRoutes)
app.use('/users', userRoutes)

app.use(function (req, res, next) {
	return next(new NotFoundError())
})

app.use(function (error, req, res, next) {
	console.error(error.stack)
	const status = error.status || 500
	const message = error.message

	return res.status(status).json({ error: { message, status } })
})

module.exports = app
