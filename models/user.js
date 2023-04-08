const db = require('../db')
const bcrypt = require('bcrypt')
const {
	UnathorizedError,
	ExpressError,
	BadRequestError,
	NotFoundError,
} = require('../expressError')

class User {
	static async authenticate(username, password) {
		const res = await db.query(
			`SELECT username,
            password,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            is_admin AS "isAdmin"
            FROM users
            WHERE username=$1`,
			[username]
		)

		const user = res.rows[0]

		if (user) {
			const valid = await bcrypt.compare(password, user.password)
			if (valid) {
				return user
			}

			throw new console.error('username or password is incorrect')
		}
	}

	static async register({
		username,
		password,
		firstName,
		lastName,
		email,
		isAdmin,
	}) {
		const checkDuplicate = await db.query(
			`SELECT username
            FROM users
            WHERE username=$1`,
			[username]
		)

		if (checkDuplicate.rows[0]) {
			throw new BadRequestError('This user already exists')
		}

		if (!password) {
			throw new BadRequestError('No password given')
		}

		const hashedPassword = await bcrypt.hash(password, 12)

		const res = await db.query(
			`INSERT INTO users 
            (username,
                password,
                first_name,
                last_name,
                email,
                is_admin)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING username, first_name AS "firstName",
                last_name AS "lastName",
                email,
                is_admin AS "isAdmin"`,
			[username, hashedPassword, firstName, lastName, email, isAdmin]
		)

		const user = res.rows[0]

		return user
	}

	static async getAll() {
		const res = await db.query(
			`SELECT username,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
			default_address AS "defaultAddress",
			default_num_of_restaurants AS "defaultNumOfRestaurants",
			default_price_level AS "defaultPriceLevel",
            is_admin AS "isAdmin"
            FROM users
            ORDER BY username`
		)

		return res.rows
	}

	static async get(username) {
		const res = await db.query(
			`SELECT username,
        first_name AS "firstName",
        last_name AS "lastName",
        email,
		default_address AS "defaultAddress",
		default_num_of_restaurants AS "defaultNumOfRestaurants",
		default_price_level AS "defaultPriceLevel",
        is_admin AS "isAdmin"
        FROM users
        WHERE username=$1`,
			[username]
		)

		const user = res.rows[0]

		if (!user) {
			throw new NotFoundError(`Couldn't find user: ${username}`)
		}

		return user
	}

	static async remove(username) {
		let res = await db.query(
			`DELETE
			FROM users
			WHERE username=$1
			RETURNING username`,
			[username]
		)

		const user = res.rows[0]

		if (!user) {
			throw new NotFoundError(`Couldn't find user: ${username}`)
		}
	}

	static async update(username, data) {
		console.log(data)
		const res = await db.query(
			`UPDATE users
			SET email = $1,
			default_address = $2,
			default_num_of_restaurants = $3,
			default_price_level = $4
			WHERE username=$5
			RETURNING username, 
				first_name AS "firstName",
            	last_name AS "lastName",
                email,
				default_address AS "defaultAddress",
				default_num_of_restaurants AS "defaultNumOfRestaurants",
				default_price_level AS "defaultPriceLevel"`,
			[
				data.email,
				data.defaultAddress,
				data.defaultNumOfRestaurants,
				data.defaultPriceLevel,
				username,
			]
		)

		const user = res.rows[0]
		console.log(user)
		if (!user) throw new NotFoundError(`No user ${username}`)
		return user
	}
}

module.exports = User
