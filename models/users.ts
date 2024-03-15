// ALL TESTED
import { readableStreamToJSON } from 'bun'

import { mount_db, DB } from '../helpers/database'
import type { User } from '../schema/user'

const db = mount_db(DB.users)

export const get_user = (email: User['email']) => {
	const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email)
	return user
}

export const insert_user = (user: User) => {
	db.prepare('INSERT INTO users (email, domain, lang, is_admin, created_by) VALUES (?, ?, ?, ?, ?)').run([
		user.email,
		user.domain,
		user.lang,
		user.is_admin,
		user.created_by
	])
	return
}

export const delete_user = (email: User['email']) => {
	db.prepare('DELETE FROM users WHERE email = ?').run(email)
	return
}

export const delete_users = (domain: User['domain']) => {
	db.prepare('DELETE FROM users WHERE domain = ?').run(domain)
	return
}

export const update_user_lang = (email: User['email'], lang: User['lang']) => {
	db.prepare('UPDATE users SET lang = ? WHERE email = ?').run([lang, email])
	return
}

export const update_user_role = (email: User['email'], bool: User['is_admin']) => {
	db.prepare('UPDATE users SET is_admin = ? WHERE email = ?').run([bool, email])
	return
}

export const get_users = (domain: User['domain']) => {
	const users = db.prepare('SELECT * FROM users WHERE domain = ? ORDER BY email').all(domain)
	return users
}

export const update_third_party_banned_domains = async () => {
	const url = 'https://raw.githubusercontent.com/Kikobeats/free-email-domains/master/domains.json'

	const data = await fetch(url)
	const domains = (await readableStreamToJSON(data.body)) as JSON

	// TODO: insert by chunk
	for (const domain of domains) {
		db.prepare('INSERT OR IGNORE INTO banned (domain) VALUES (?)').run(domain)
	}

	console.info('[🤖 — cronbot]: third party banned domains updated')
	return
}

//
//
//
//
//
//
export const count_users = () => {
	const users = db.prepare('SELECT COUNT(*) as count FROM users').get()
	const drafts = db.prepare('SELECT COUNT(*) as count FROM drafts').get()
	return { drafts: drafts.count, users: users.count }
}
