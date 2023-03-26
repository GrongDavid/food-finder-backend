const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')
//unauthorized error

function authenticateJWT(req, res, next) {
	try {
		const header = req.headers && req.headers.authorization
		if (header) {
			const token = header.replace(/^[Bb]earer /, '').trim()
			res.locals.user = jwt.verify(token, SECRET_KEY)
		}
		return next()
	} catch (error) {
		return next()
	}
}

function ensureLoggedIn(req, res, next) {
	try {
		if (!res.locals.user) {
			//throw unathorized error
		}
		return next()
	} catch (error) {
		return next(error)
	}
}

function ensureAdmin(req, res, next) {
	try {
		if (!res.locals.user || !res.locals.user.isAdmin) {
			//throw unauthorized
		}
		return next()
	} catch (error) {
		return next(error)
	}
}

function ensureCorrectUserOrAdmin(req, res, next) {
	try {
		const user = res.locals.user
		if (!(user && (user.isAdmin || user.username === req.params.username))) {
			//throw new unathorized
		}
	} catch (error) {
		return next(error)
	}
}

module.exports = {
	authenticateJWT,
	ensureLoggedIn,
	ensureAdmin,
	ensureCorrectUserOrAdmin,
}
