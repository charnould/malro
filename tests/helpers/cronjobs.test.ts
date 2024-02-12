import { setSystemTime, beforeEach, expect, it } from 'bun:test'
import { spawnSync, sleep, file } from 'bun'

import { update_third_party_banned_domains } from '../../models/users'
import { vacuum_trashed_events } from '../../models/events'
import { save_event, Table } from '../../models/events'
import { mount_db, DB } from '../../helpers/database'
import { dummy_event } from '../dummy/events'

const events_db = mount_db(DB.events, { readwrite: true, create: false })
const users_db = mount_db(DB.users, { readwrite: true, create: false })

beforeEach(() => {
	setSystemTime()
	events_db.query('DELETE FROM events').run()
	events_db.query('DELETE FROM calendar').run()
	events_db.query('DELETE FROM linked_to').run()
	users_db.query('DELETE FROM users').run()
	users_db.query('DELETE FROM drafts').run()
})

//
//
//
//
//
//
it('should upload banned domains in DB', async () => {
	// Check if there is no banned domains in DB before the real test.
	users_db.prepare('DELETE FROM banned').run()
	let banned_domains_in_db = users_db.prepare('SELECT * FROM banned').all()
	expect(banned_domains_in_db.length).toBe(0)

	// Fill DB with the real banned domains...
	await update_third_party_banned_domains()
	// ... and check DB is really filled
	banned_domains_in_db = users_db.prepare('SELECT * FROM banned').all()
	expect(banned_domains_in_db.length).toBeGreaterThan(4000)
})

//
//
//
//
//
//
it.skip('should archive events.db in datastore > archives', async () => {
	spawnSync(['bash', 'run.sh', 'archive_db'])
	await sleep(1500)
	const today = new Date().toISOString().substring(0, 10)
	const does_archive_exist = await file(`./datastore/archives/${today}.db.gz`).exists()
	expect(does_archive_exist).toBe(true)
})

//
//
//
//
//
//
it('should vacuum trashed events', async () => {
	setSystemTime(new Date('2023-07-01T12:30:00.000Z'))
	// Make a fake event a TRASH...
	const e1 = { ...dummy_event }
	e1.status = 'trashed'
	spawnSync(['convert', 'xc:white', `datastore/images/${e1.id}.webp`])
	spawnSync(['convert', 'xc:white', `datastore/images/originals/${e1.id}.webp`])

	// ...and another fake event a SPAM
	const e2 = { ...dummy_event }
	e2.id = '712166e7-c8fd-43c6-a6db-6eafcc809ad5'
	e2.status = 'trashed'
	spawnSync(['convert', 'xc:white', `datastore/images/${e2.id}.webp`])
	spawnSync(['convert', 'xc:white', `datastore/images/originals/${e2.id}.webp`])

	// ...and another fake event a published
	const e3 = { ...dummy_event }
	e3.id = '0588c0cf-3730-4746-9e7e-76e9a2723692'
	e3.status = 'published'
	spawnSync(['convert', 'xc:white', `datastore/images/${e3.id}.webp`])
	spawnSync(['convert', 'xc:white', `datastore/images/originals/${e3.id}.webp`])

	// ...and save both in DB.
	save_event(e1, Table.events)
	save_event(e2, Table.events)
	save_event(e3, Table.events)

	// DB must contain 3 events...
	const events_in_db_before = events_db.prepare('SELECT * FROM events').all()
	expect(events_in_db_before.length).toBe(3)

	// ...and all images must exist
	expect(await file(`./datastore/images/${e1.id}.webp`).exists()).toBe(true)
	expect(await file(`./datastore/images/${e2.id}.webp`).exists()).toBe(true)
	expect(await file(`./datastore/images/${e3.id}.webp`).exists()).toBe(true)
	expect(await file(`./datastore/images/originals/${e1.id}.webp`).exists()).toBe(true)
	expect(await file(`./datastore/images/originals/${e2.id}.webp`).exists()).toBe(true)
	expect(await file(`./datastore/images/originals/${e3.id}.webp`).exists()).toBe(true)

	// ...and after vacuuming...
	// ...only one event in DB...
	setSystemTime()
	vacuum_trashed_events()
	const events_in_db_after = events_db.prepare('SELECT * FROM events').all()
	expect(events_in_db_after.length).toBe(1)

	// ...and some images
	await sleep(500)
	expect(await file(`./datastore/images/${e1.id}.webp`).exists()).toBe(false)
	expect(await file(`./datastore/images/${e2.id}.webp`).exists()).toBe(false)
	expect(await file(`./datastore/images/${e3.id}.webp`).exists()).toBe(true)
	expect(await file(`./datastore/images/originals/${e1.id}.webp`).exists()).toBe(false)
	expect(await file(`./datastore/images/originals/${e2.id}.webp`).exists()).toBe(false)
	expect(await file(`./datastore/images/originals/${e3.id}.webp`).exists()).toBe(true)
})
