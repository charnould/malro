import { setCookie } from 'hono/cookie'
import { Context } from 'hono'
import { env } from 'bun'

import { extract_domain_from_email, encrypt_jwt, decrypt_jwt } from '../helpers/auth'
import { insert_user, get_user } from '../models/users'
import { User } from '../schema/user'

export const controller = async (c: Context) => {
	// Verify and sign JWT
	const token_to_verify = c.req.query('verify')
	const { email } = await decrypt_jwt(token_to_verify, env.CRYPTO_1)

	const does_user_exist = get_user(email)
	if (does_user_exist === null) {
		const user: User = User.parse({
			domain: extract_domain_from_email(email),
			is_admin: 'true',
			email: email
		})

		insert_user(user)
	}

	const cookie_token = await encrypt_jwt({ email: email }, env.CRYPTO_2, '7d')

	// Set malro cookie and redirect to /supervisor
	setCookie(c, 'malro', cookie_token) // todo: add options to cookie (secure, http, sameOrigin...)
	return c.redirect('/dashboard')
}
