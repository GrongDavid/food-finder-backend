const db = require('../db')
const bcrypt = require('bcrypt')

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

			//throw new UnathorizedError
		}
	}

	static async register(
		username,
		password,
		firstName,
		lastName,
		email,
		isAdmin
	) {
		const checkDuplicate = await db.query(
			`SELECT username
            FROM users
            WHERE username=$1`,
			[username]
		)

		if (checkDuplicate.rows[0]) {
			//throw error
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
                RETURNING username, first_name AS "firstName,
                last_name AS "lastName,
                email,
                is_admin AS "isAdmin`,
			[username, hashedPassword, firstName, lastName, email, isAdmin]
		)

		const user = res.rows[0]

		return user
	}

	static async getAll() {
		const res = await db.query(
			`SELECT username,
            first_name AS "firstName",
            last_name AS "lastName,
            email,
            is_admin AS "isAdmin"
            FROM users
            ORDER BY username`
		)

		return res.rows
	}

	static async get(username) {
		const res = await db.query(
			`
        SELECT username,
        first_name AS "firstName,
        last_name AS "lastName",
        email,
        is_admin AS "isAdmin
        FROM users
        WHERE username=$1`,
			[username]
		)

		const user = res.rows[0]

		if (!user) {
			//throw error
		}
	}

	static async remove(username) {
		let res = await db.query(
			`DELETE
			FROM users
			WHERE username=$1
			RETURNING username`,
			[username]
		)

		const user = result.rows[0]

		if (!user) {
			//throw error
		}
	}
}

module.exports = User
