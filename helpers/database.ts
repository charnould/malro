import { Database } from 'bun:sqlite'

export enum DB {
	events = 'events',
	users = 'users'
}

export const mount_db = (db: DB, options?) => new Database(`./datastore/${db}.db`, options)
