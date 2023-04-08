'use strict'
/** Database setup for jobly. */
const { Client } = require('pg')
const { getDatabaseUri, DB_PASSWORD } = require('./config')

let db

if (process.env.NODE_ENV === 'production') {
	console.log('production')
	db = new Client({
		host: process.env.HOST_ENV,
		port: 5432,
		database: 'food_finder',
		user: 'food_finder_user',
		password: DB_PASSWORD,
		ssl: {
			rejectUnauthorized: false,
		},
	})
} else {
	db = new Client({
		connectionString: getDatabaseUri(),
	})
}

db.connect()

module.exports = db
