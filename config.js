'use strict'

/** Shared config for application; can be required many places. */

const SECRET_KEY = process.env.SECRET_KEY || 'secret-dev'

const PORT = 3001

const DB_PASSWORD = 'Kd2Rwuusxkhy1kXrIcXsgNxBsLDRnPet'

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12

console.log('Jobly Config:'.green)
console.log('SECRET_KEY:'.yellow, SECRET_KEY)
console.log('PORT:'.yellow, PORT.toString())
console.log('BCRYPT_WORK_FACTOR'.yellow, BCRYPT_WORK_FACTOR)
console.log('Database:'.yellow, getDatabaseUri())
console.log('---')

module.exports = {
	SECRET_KEY,
	PORT,
	BCRYPT_WORK_FACTOR,
	getDatabaseUri,
	DB_PASSWORD,
}
