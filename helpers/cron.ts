import { Cron } from 'croner'
import { spawn } from 'bun'

import { update_third_party_banned_domains } from '../models/users'
import { vacuum_trashed_events } from '../models/events'
import { send_report } from './send_report'

export const launch_cronjobs = () => {
	// Update banned domains using a third party list
	// Runs every monday at 01:00
	// Test: ok
	// TODO: mettre la bonne date après import initial
	Cron('10 9 * * 3', () => update_third_party_banned_domains())

	// Delete old trashed events and spams from events DB
	// Runs every day at 01:00
	// TODO: vacuum DB (sqlite pragma)
	// Test: NOK
	Cron('0 1 * * *', () => vacuum_trashed_events())

	// Archive and gzip events db
	// Runs every day at 23:45
	// Test: ok
	Cron('45 23 * * *', () => spawn(['bash', 'run.sh', 'archive_db']))

	// Send a "Daily Report" to charnould@icloud.com
	// Runs every day at 23:59
	Cron('59 23 * * *', () => send_report())

	// TODO: (?) Delete old archives
	// TODO: (?) Identify duplicates and inform users
	// TODO: (?) inform user to update a perpetual event with new dates
	return
}
