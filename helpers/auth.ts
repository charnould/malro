import { getCookie } from 'hono/cookie'
import type { Context, Next } from 'hono'
import * as jose from 'jose'
import { env } from 'bun'
import { z } from 'zod'

import { click_magic_link, ask_admin } from '../views/emails/login'
import { get_users, get_user } from '../models/users'
import { get_event, Table } from '../models/events'
import { mount_db, DB } from './database'
import { send_email } from './emailer'
import type { User } from '../schema/user'

const db = mount_db(DB.users)

//
//
//
//
//
//
export const extract_domain_from_email = (email: User['email']) =>
	email.toLowerCase().trim().split('@')[1].split('.').slice(-2).join('.')

//
//
//
//
//
//
// is_user_authorized()
// Check if a user trying to login/sign up is allowed to do so.
// Two cases are considered: very first user and next users.
//

// Types
export const Is_user_authorized = z.enum([
	'domain_banned',
	'new_organization',
	'user_already_exists',
	'user_need_admin_permission'
])

// eslint-disable-next-line no-redeclare
export type Is_user_authorized = z.infer<typeof Is_user_authorized>

/* Function */
export const is_user_authorized = async (email: string) => {
	const domain = extract_domain_from_email(email)

	/**
	 * malro bans free email provider domains (like Gmail, iCloud, etc.) to prevent spamming.
	 * Thus, if Domain is banned, User cannot use malro.
	 */
	let is_domain_authorized = true
	const query = await db.prepare('SELECT * FROM banned WHERE domain = ?').get(domain)
	if (query !== null) is_domain_authorized = false

	if (!is_domain_authorized) return 'banned_domain'

	/**
	 * If Domain is allowed and it's the very first user for a domain trying to sign up/login,
	 * he/she is authorized and is granted administrator role. Admin is then the only
	 * one able to grant access to other users for this domain through its `settings`.
	 */
	const users = get_users(domain)
	if (users.length === 0) return 'new_organization'

	/**
	 * If Domain is allowed and Email is in Users DB
	 * that means that User is allowed to use malro.
	 */
	if (users.some((user) => user.email === email)) return 'user_already_exists'

	/**
	 * Consequently, in all other cases,
	 * that means that User need admin permission.
	 */
	return 'user_needs_admin_permission'
}

//
//
//
//
//
//
// Send a magic link by email to a user
export const send_magic_link_to = async (email: string) => {
	const token = await encrypt_jwt({ email: email }, env.CRYPTO_1, '1d')
	const magic_link = `${env.BASE_URL}/token?verify=${token}`
	const message = click_magic_link(magic_link).toString()
	await send_email({ subject: 'Login to MALRO.org', email: message, to: email })
	return
}

//
//
//
//
//
//
// Send a list of admin emails to a user that wants to be granted an access
export const send_admin_emails_to = async (email: string) => {
	const domain = extract_domain_from_email(email)
	const users = get_users(domain)
	const admins = users
		.filter((user: User) => user.is_admin === 'true')
		.map((user: User) => user.email)
		.sort()
	const message = ask_admin(admins).toString()
	await send_email({ subject: 'Login to MALRO.org', email: message, to: email })
	return
}

//
//
//
//
//
//
// is_auth() Middleware
// Check for each request if the user is authenticated or not
// and respond accordingly: move on or redirect
export const is_auth = async (c: Context, next: Next) => {
	try {
		// Decypher email
		const cookie = getCookie(c, 'malro')
		const { email }: User['email'] = await decrypt_jwt(cookie, env.CRYPTO_2)

		// Case 1. Check if user exists in DB
		const user = await get_user(email)
		if (user === undefined) return c.redirect('/')

		// Case 2. Check if user has access to this event/draft
		const kind = c.req.param('kind')
		if (kind === 'event' || kind === 'draft') {
			let created_by
			const id = c.req.param('id')
			if (kind === 'draft') created_by = get_event(id, Table.drafts)?.created_by
			if (kind === 'event') created_by = get_event(id, Table.events)?.created_by

			const domain = extract_domain_from_email(email)
			if (domain !== created_by) return c.text("👀 — You don't have access to this event.")
		}

		// Otherwise, user can access this route!
		c.set('user', user)
		return next()
	} catch {
		return c.redirect('/')
	}
}

//
//
//
//
//
//
// is_setup() Middleware
// Check if user has set up its account (lang)
export const is_setup = async (c: Context, next: Next) => {
	if (c.get('user').lang === '') return c.redirect('/settings?setup=true')
	return next()
}

//
//
//
//
//
//
// Encrypt JWT
// Types
const Payload = z.object({ email: z.string().email() })
type Payload = z.infer<typeof Payload>

export const encrypt_jwt = async (payload: Payload, secret: string, expiration_time: string) => {
	const key = jose.base64url.decode(secret)
	return await new jose.EncryptJWT(payload)
		.setProtectedHeader({ enc: 'A128CBC-HS256', alg: 'dir' })
		.setIssuer('malro_server')
		.setAudience('malro_user')
		.setExpirationTime(expiration_time) // ex. "1h"
		.setIssuedAt()
		.encrypt(key)
}

//
//
//
//
//
//
// Decrypt JWT
export const decrypt_jwt = async (token: string, secret: string) => {
	const key = jose.base64url.decode(secret)
	const { payload } = await jose.jwtDecrypt(token, key, {
		issuer: 'malro_server',
		audience: 'malro_user'
	})
	return payload
}
