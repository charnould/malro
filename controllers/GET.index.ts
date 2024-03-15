import { deleteCookie, getCookie } from 'hono/cookie'
import type { Context } from 'hono'

import { view } from '../views/index.html'
import type { Options } from '../schema/api'

export const controller = async (c: Context) => {
	const translation: string = c.get('lang').ui as string

	const options = getCookie(c, 'malro_embed')
	let readable_options
	deleteCookie(c, 'malro_embed')
	if (options) readable_options = JSON.parse(options) as Options

	return c.html(await view(translation, undefined, readable_options))
}
