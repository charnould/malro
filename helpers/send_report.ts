import { html } from 'hono/html'

import { count_events } from '../models/events'
import { count_users } from '../models/users'
import { send_email } from './emailer'

// Quick and ugly, but useful
export const send_report = async () => {
	const events = count_events()
	const users = count_users()

	const message = html` <h3>Daily Report</h3>
    <p>Published: ${events.published}</p>
    <p>Trashed: ${events.trash}</p>
    <p>Drafts: ${users.drafts}</p>
    <p>Users: ${users.users}</p>`

	await send_email({ subject: 'MALRO Daily Report', to: 'charnould@icloud.com', email: message })
	console.info('[🤖 — cronbot]: Daily Report sent')
	return
}
