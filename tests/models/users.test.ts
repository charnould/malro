import { afterEach, expect, it } from 'bun:test'

import {
	update_user_role,
	update_user_lang,
	count_users,
	delete_user,
	insert_user,
	get_users,
	get_user
} from '../../models/users'
import { mount_db, DB } from '../../helpers/database'
import { u1, u2, u3 } from '../dummy/users'
import { User } from '../../schema/user'
import { Table, save_event } from '../../models/events'
import { dummy_event } from '../dummy/events'

const db = mount_db(DB.users)

afterEach(() => {
	db.query('DELETE FROM users').run()
	db.query('DELETE FROM drafts').run()
})

//
//
//
//
//
//
it('should return a complete user (auto)', () => {
	const input = User.parse(u1)

	expect(input).toMatchObject({
		created_at: new Date().toISOString().substring(0, 16),
		email: 'u1@malro.org',
		domain: 'malro.org',
		created_by: 'auto',
		is_admin: 'false',
		lang: ''
	})
})

//
//
//
//
//
//
it('should return a complete user (created_by)', () => {
	const input = User.parse(u3)

	expect(input).toMatchObject({
		created_at: new Date().toISOString().substring(0, 16),
		created_by: 'u1@malro.org',
		email: 'u3@malro.org',
		domain: 'malro.org',
		is_admin: 'false',
		lang: ''
	})
})

//
//
//
//
//
//
it('should insert and get 1 user', async () => {
	const input = User.parse(u1)
	insert_user(input)

	const output = await get_user(input.email)

	expect(output).toMatchObject({
		created_at: new Date().toISOString().substring(0, 16),
		email: 'u1@malro.org',
		domain: 'malro.org',
		created_by: 'auto',
		is_admin: 'false',
		lang: ''
	})
})

//
//
//
//
//
//
it('should get all users', () => {
	insert_user(User.parse(u1))
	insert_user(User.parse(u2))

	const users = get_users('malro.org')

	expect(users.length).toStrictEqual(2)
	expect(users).toMatchObject([
		{
			created_at: new Date().toISOString().substring(0, 16),
			email: 'u1@malro.org',
			domain: 'malro.org',
			created_by: 'auto',
			is_admin: 'false',
			lang: ''
		},
		{
			created_at: new Date().toISOString().substring(0, 16),
			email: 'u2@malro.org',
			domain: 'malro.org',
			created_by: 'auto',
			is_admin: 'false',
			lang: ''
		}
	])
})

//
//
//
//
//
//
it('should update user lang', () => {
	const input = User.parse(u1)
	insert_user(input)
	update_user_lang(input.email, 'fr')

	const output = get_user(input.email)

	expect(output).toMatchObject({
		created_at: new Date().toISOString().substring(0, 16),
		email: 'u1@malro.org',
		domain: 'malro.org',
		created_by: 'auto',
		is_admin: 'false',
		lang: 'fr'
	})
})

//
//
//
//
//
//
it('should update user role', () => {
	const input = User.parse(u1)
	insert_user(input)
	update_user_role(input.email, 'true')

	const output = get_user(input.email)

	expect(output).toMatchObject({
		created_at: new Date().toISOString().substring(0, 16),
		email: 'u1@malro.org',
		domain: 'malro.org',
		created_by: 'auto',
		is_admin: 'true',
		lang: ''
	})
})

//
//
//
//
//
//
it('should delete 1 user', () => {
	const input = User.parse(u1)
	insert_user(input)
	delete_user(input.email)

	const output = get_user(input.email)

	expect(output).toStrictEqual(null)
})

//
//
//
//
//
//
it('should count users and drafts', () => {
	insert_user(User.parse(u1))
	insert_user(User.parse(u2))
	insert_user(User.parse(u3))
	save_event(dummy_event, Table.drafts)

	const count = count_users()
	expect(count.drafts).toBe(1)
	expect(count.users).toBe(3)
})
