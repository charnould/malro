import { z } from 'zod'

import { LANG } from '../enums/lang'

export const Options = z.object({
	display_formatted_query: z.string().or(z.null()),
	is_valid: z.boolean().default(true).or(z.null()),
	format: z.enum(['json', 'html']).or(z.null()),
	embed_code: z.string().or(z.null()),
	html_link: z.string().or(z.null()),
	json_link: z.string().or(z.null()),
	referral: z.string().or(z.null()),
	embed: z.boolean().default(true),
	origin: z.string().or(z.null()),
	height: z.string().or(z.null()),
	query: z.string().or(z.null()),
	lang: z.enum(LANG)
})

// eslint-disable-next-line no-redeclare
export type Options = z.infer<typeof Options>
