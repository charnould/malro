import { Context, Next } from 'hono'
import { raw } from 'hono/html'

import { WIDGET_TRANSLATION, INDEX_TRANSLATION, APP_TRANSLATION } from '../enums/translation'

/** */
export const translate_in = async (c: Context, next: Next) => {
	let selected_lang = undefined
	let lang_order = []

	if (c.req.query().lang !== undefined) lang_order.push(c.req.query().lang)
	if (c.req.header('accept-language') !== undefined) {
		lang_order = lang_order.concat(c.req.header('accept-language').split(','))
	}

	lang_order.push('en') // default lang
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error - See https://github.com/microsoft/TypeScript/issues/32098 (for 'match' below)
	lang_order = lang_order.map((l) => l.match(/^([^;-\s])+/)[0])
	lang_order = [...new Set(lang_order)]

	for (const lang of lang_order) {
		if (c.req.param('sql')) selected_lang = WIDGET_TRANSLATION.find((l) => l === lang)
		if (c.req.path === '/') selected_lang = INDEX_TRANSLATION.find((l) => l === lang)
		else selected_lang = APP_TRANSLATION.find((l) => l === lang)
		if (selected_lang !== undefined) break
	}

	c.set('lang', { ui: selected_lang, event: lang_order })

	await next()
	return c.res
}

/** */
export const translate = async (key: string, from: string, lang: string) => {
	const { default: translations } = await import(`../locales/${from}/${lang}.json`)
	return raw(translations[key])
}
