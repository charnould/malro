import type { Context } from 'hono'
import { z } from 'zod'

import { send_admin_emails_to, send_magic_link_to } from '../helpers/auth'
import { is_user_authorized } from '../helpers/auth'
import { view } from '../views/index.html'

export enum Message {
	banned_domain = 0,
	check_mailbox = 1
}

// TODO: redirect avec un set/get ????
/* Controller */
export const controller = async (c: Context) => {
	const data = await c.req.parseBody()
	const email: string = data.email.trim().toLowerCase()
	const is_email_valid: boolean = z.string().email().safeParse(email).success
	const translation = c.get('lang').ui

	if (!is_email_valid) {
		return c.html(await view(translation, Message.banned_domain), 303)
	}
	switch (await is_user_authorized(email)) {
		/* Due to its Domain, User cannot use malro */
		case 'banned_domain': {
			return c.html(await view(translation, Message.banned_domain), 303)
		}

		/* User is in DB. We send him/her a magic link to login by email */
		case 'user_already_exists': {
			await send_magic_link_to(email)
			return c.html(await view(translation, Message.check_mailbox), 303)
		}
		/* User needs Admin permission. We send him/her an email saying to get in touch with his/her Admin */
		case 'user_needs_admin_permission': {
			await send_admin_emails_to(email)
			return c.html(await view(translation, Message.check_mailbox), 303)
		}
		/* New user is created with Admin role for this Domain and we send him/her a magic link to login by email */
		case 'new_organization': {
			await send_magic_link_to(email)
			return c.html(await view(translation, Message.check_mailbox), 303)
		}
	}
}
