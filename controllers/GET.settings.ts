import { Context } from 'hono'

import { view } from '../views/settings.html'
import { get_users } from '../models/users'
import { User } from '../schema/user'

/* Controller */
export const controller = async (c: Context) => {
	const self = c.get('user')
	const domain = self.domain
	const users = await get_users(domain)

	const can_delete_own_account = () => {
		if (users.length === 1) {
			return false
		}
		const is_there_another_admin = users.some((user: User) => user.email !== self.email && user.is_admin === 'true')
		return is_there_another_admin
	}

	const need_setup = c.req.query('setup') === undefined ? false : true

	return c.html(view(self, users, need_setup, can_delete_own_account()))
}
