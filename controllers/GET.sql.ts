import type { Context } from 'hono'

import { keep_only_future_occurrences, get_relevant_translation } from '../helpers/transform'
import { turn_stringified_into_parsed_events } from '../helpers/transform'
import { view as v001 } from '../views/widgets/001.html'
import { mount_db, DB } from '../helpers/database'
import { build_options } from '../helpers/embed'
import type { Event } from '../schema/event'

const db = mount_db(DB.events, { readonly: true })

export const controller = async (c: Context) => {
	try {
		c.set('submitted_query', c.req.param('sql'))

		// TODO: make all transform into build options!
		const options = build_options({
			referral: c.req.query('referral') === undefined ? null : decodeURI(c.req.query('referral')!),
			decoded_url: decodeURI(c.req.url),
			format: c.req.query('format'),
			embed: c.req.query('embed'),
			lang: c.get('lang').ui,
			origin: 'api'
		})

		const results = db.query(options.query).all() // TODO: Check if SQL query contains 'limit'?

		// Allow anyone to embed MALRO event anywhere
		c.header('Access-Control-Allow-Origin', '*')
		c.header('Access-Control-Allow-Methods', 'GET')

		// Respond with `json`
		if (options.format === 'json') {
			console.info({ date: new Date().toISOString(), query: options.query, status: 'success', format: 'json' })
			return c.json(results)
		}
		// ...or - if query returns no event - a light `html` response
		if (results.length === 0) {
			return c.html(`Your query is ✅ but returns 0️⃣ result.<br>${options.display_formatted_query}`)
		}
		// ...or - if query returns 1+ events - a real `html` response
		const parsed_results: Event[] = turn_stringified_into_parsed_events(results)

		for (const result of parsed_results) {
			result.calendar = keep_only_future_occurrences(result.calendar)
			result.description = get_relevant_translation(result.description, c.get('lang').event)
		}

		return c.html(await v001(parsed_results, options))
	} catch (e) {
		console.info({ date: new Date().toISOString(), query: c.get('submitted_query'), status: 'error' })
		return c.html(`❌ — Your query below is not valid.<br>${c.get('submitted_query')}`, 400)
	}
}
