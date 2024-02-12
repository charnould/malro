import { format } from 'sql-formatter'
import { env } from 'bun'

import { Options } from '../schema/api'

export const build_options = (data) => {
	const options: Options = {
		display_formatted_query: null,
		referral: data.referral,
		origin: data.origin,
		embed_code: null,
		lang: data.lang,
		html_link: null,
		json_link: null,
		is_valid: null,
		embed: false,
		format: null,
		query: null
	}

	options.query = data.query
	options.embed = data.embed === 'true' ? true : false
	options.format = data.format === 'json' ? 'json' : '001'

	if (typeof options.referral === 'string') {
		const regex = /^<a.+>.+<\/a>$/.test(options.referral)
		options.referral = regex === true ? options.referral : null
	}

	// Prepare/clean SQL query
	let cleaned_query: string

	if (options.origin === 'api') cleaned_query = data.decoded_url.split('/')[4].split('?')[0]
	if (options.origin === 'embed') cleaned_query = options.query
	if (options.origin === 'example') cleaned_query = options.query

	cleaned_query = format(cleaned_query, {
		expressionWidth: 900,
		denseOperators: true,
		keywordCase: 'lower',
		language: 'sqlite',
		tabWidth: 1
	})

	options.query = cleaned_query
		.replace(/\r?\n|\r/g, ' ') // Delete line breaks
		.replace(/\s{2,}/g, ' ') // Delete double spaces
		.replace(/"/g, "'") // Change double quotes for single
	options.html_link = encodeURI(`${env.BASE_URL}/sql/${options.query}`)
	options.json_link = encodeURI(`${env.BASE_URL}/sql/${options.query}?format=json`)
	options.display_formatted_query = format(options.query, {
		indentStyle: 'standard',
		keywordCase: 'upper',
		language: 'sqlite'
	})

	options.embed_code = `<div style="height:460px;width:100%"><iframe width=100% height="100%" src="${options.html_link}?embed=true" frameborder=0 loading=lazy></iframe></div>`

	return options
}
