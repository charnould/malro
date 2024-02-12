import { deleteCookie, setCookie } from 'hono/cookie'
import { Context } from 'hono'

import {
	unlink_an_organization_from_an_event,
	link_an_organization_to_an_event,
	archive_organization,
	trash_organization,
	duplicate_event,
	trash_event
} from '../models/events'
import { update_user_role, update_user_lang, insert_user, delete_user, get_user } from '../models/users'
import { extract_domain_from_email } from '../helpers/auth'
import { User } from '../schema/user'

export const controller = async (c: Context) => {
	try {
		const body = await c.req.parseBody()
		Object.keys(body).forEach((k) => (body[k] = body[k].trim()))

		const email = body.email?.trim().toLowerCase() || null

		switch (c.req.query('action')) {
			/**
			 *
			 * Change admin status
			 *
			 */
			case 'change_admin_status': {
				const user: User = (await get_user(body.email)) as User
				const admin_status = user.is_admin === 'true' ? 'false' : 'true'
				update_user_role(body.email, admin_status)
				return c.redirect('/settings')
			}

			/**
			 *
			 * Logout user
			 *
			 */
			case 'logout': {
				deleteCookie(c, 'malro')
				return c.redirect('/')
			}

			/**
			 *
			 * Remove user
			 *
			 */
			case 'remove_user': {
				/* Remove self */
				if (email === 'self') {
					delete_user(c.get('user').email)
					setCookie(c, 'malro', null)
					return c.redirect('/')
				}
				/* Remove another user */
				delete_user(email)
				return c.redirect('/settings')
			}

			/**
			 *
			 * Add user
			 *
			 */
			case 'add_user': {
				if (c.get('user').domain === extract_domain_from_email(email)) {
					const new_user = User.parse({
						domain: extract_domain_from_email(email),
						created_by: c.get('user').email,
						email: email
					})
					insert_user(new_user)
				}
				return c.redirect('/settings')
			}

			/**
			 *
			 * Change lang
			 *
			 */
			case 'change_lang': {
				update_user_lang(c.get('user').email, body.lang)
				return c.redirect('/dashboard')
			}
			/**
			 *
			 * Link organization to an event
			 *
			 */
			case 'link_to_an_event': {
				link_an_organization_to_an_event(body.event_id, c.get('user').domain)
				return c.redirect('/dashboard')
			}

			/**
			 *
			 * UNLink organization from an event
			 *
			 */
			case 'unlink_from_an_event': {
				unlink_an_organization_from_an_event(body.event_id, c.get('user').domain)
				return c.redirect('/dashboard')
			}

			/**
			 *
			 * Duplicate an event
			 *
			 */
			case 'duplicate_event': {
				duplicate_event(body.event_id, c.get('user').domain)
				return c.redirect('/dashboard')
			}

			/**
			 *
			 * Trash an event
			 *
			 */
			case 'trash_event': {
				trash_event(body.event_id)
				return c.redirect('/dashboard')
			}

			/**
			 *
			 * Archive org
			 *
			 */
			case 'archive_organization': {
				const domain = c.get('user').domain
				archive_organization(domain)
				return c.redirect('/')
			}

			/**
			 *
			 * Trash org
			 *
			 */
			case 'trash_organization': {
				const domain = c.get('user').domain
				trash_organization(domain)
				return c.redirect('/')
			}

			default:
				return c.redirect('/settings')
		}
	} catch (e) {
		console.info(e)
		return c.redirect('/settings')
	}
}
