/* eslint-disable perfectionist/sort-objects */

import { z } from 'zod'

import {
	strip_multiple_spaces_and_emojis,
	sort_calendar_by_start_date,
	capitalize_firstname
} from '../helpers/transform'
import { CURRENCY } from '../enums/currency'
import { TIMEZONE } from '../enums/timezone'
import { COUNTRY } from '../enums/country'
import { FEATURE } from '../enums/feature'
import { STATUS } from '../enums/status'
import { TYPE } from '../enums/type'
import { LANG } from '../enums/lang'

export const Event = z
	.object({
		//
		//
		//
		//
		// Generic metadata
		id: z.string().uuid(),
		status: z.enum(STATUS, { errorMap: () => ({ message: 'is_required' }) }),
		created_by: z.string().trim().toLowerCase(),
		updated_at: z.string().datetime(),
		linked_to: z.array(z.string()),

		//
		//
		//
		//
		// Support
		support_phone: z
			.string()
			.transform((s) => strip_multiple_spaces_and_emojis(s))
			.transform((string) => (string === '' ? null : string)),

		support_email: z.string().email({ message: 'invalid_email_format' }).toLowerCase().trim(),

		//
		//
		//
		//
		description: z
			.array(
				z.object({
					lang: z.enum(LANG, { errorMap: () => ({ message: 'is_required' }) }),
					url: z.string().url({ message: 'invalid_url_format' }),
					title: z
						.string()
						.min(10, { message: 'too_short_for_a_title' })
						.transform((s) => strip_multiple_spaces_and_emojis(s))
						.refine(
							(s) => {
								if (s === s.toUpperCase()) return false
								return true
							},
							{ message: 'must_not_be_all_caps' }
						),
					organizer: z
						.string()
						.min(2, { message: 'too_short_for_an_organizer' })
						.transform((s) => strip_multiple_spaces_and_emojis(s))
						.refine(
							(s) => {
								if (s === s.toUpperCase()) return false
								return true
							},
							{ message: 'must_not_be_all_caps' }
						),
					content: z
						.string()
						.min(150, { message: 'too_short_for_a_description_min_150_characters' })
						.transform((s) => strip_multiple_spaces_and_emojis(s))
						.refine(
							(s) => {
								if (s === s.toUpperCase()) return false
								return true
							},
							{ message: 'must_not_be_all_caps' }
						),
					detail: z
						.string()
						.transform((s) => strip_multiple_spaces_and_emojis(s))
						.transform((detail) => (detail === '' ? null : detail))
						.refine(
							(s) => {
								if (s !== null && s === s.toUpperCase()) return false
								return true
							},
							{ message: 'must_not_be_all_caps' }
						)
				})
			)
			.min(1, { message: 'at_least_one_description' })
			.refine((ds) => ds.map((d) => d.lang).length === [...new Set(ds.map((d) => d.lang))].length, {
				message: 'descriptions_cannot_be_written_in_the_same_lang',
				path: ['description']
			}),

		//
		//
		//
		//
		// Booking

		mandatory_booking: z.boolean().default(false),

		booking_start: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { message: 'invalid_date_format' })
			.or(z.literal('').transform(() => null)),

		booking_medium: z
			.array(
				z.discriminatedUnion('type', [
					z.object({
						data: z.string().url({ message: 'invalid_url_format' }),
						allows_affiliate_partnership: z
							.boolean()
							.or(z.null())
							.or(
								z.string().transform((string) => {
									if (string === 'true') return true
									if (string === 'false') return false
									return null
								})
							)
							.default(null),
						type: z.literal('url')
					}),
					z.object({
						data: z.string().email({ message: 'invalid_email_format' }).trim().toLowerCase(),
						type: z.literal('email')
					}),
					z.object({
						data: z
							.string()
							.min(5, { message: 'too_short_for_a_phone_number' })
							.max(25, { message: 'too_long_for_a_phone_number' })
							.transform((s) => strip_multiple_spaces_and_emojis(s)),
						type: z.literal('phone')
					}),
					z.object({
						data: z
							.string()
							.min(5, { message: 'too_short_string' })
							.max(25, { message: 'too_long_string' })
							.transform((s) => strip_multiple_spaces_and_emojis(s)),
						type: z.literal('string')
					}),
					z.object({
						data: z.literal(''),
						type: z.literal('')
					})
				])
			)
			.transform((bp) => {
				const clean = bp.filter((r) => r.type !== '')
				if (clean.length === 0) return null
				return clean
			}),

		//
		//
		//
		//
		featuring: z
			.array(
				z.object({
					firstname: z.string().transform((s) => strip_multiple_spaces_and_emojis(capitalize_firstname(s))),
					lastname: z
						.string()
						.toUpperCase()
						.transform((s) => strip_multiple_spaces_and_emojis(s))
				})
			)
			.transform((featuring) => {
				const clean = featuring.filter((r) => r.lastname !== '')
				if (clean.length === 0) return null
				return clean
			}),

		//
		//
		//
		//
		// Promotion
		image_url: z
			.string()
			.url()
			.or(
				z
					.any()
					.refine((file: Blob) => file?.size >= 1, 'is_required.')
					.refine((file: Blob) => file?.size <= 5000000, 'max_file_size_is_5mb.')
				// .refine((file: Blob) => file?.type.startsWith('image/'), 'unsupported_file')
			),

		video_url: z
			.string()
			.url()
			.regex(/^https:\/\/www.youtube.com\/watch\?v=.+$/, { message: 'not_a_valid_youtube_video_url' })
			.transform((url) => {
				const video_id = url.match(/v=[a-zA-Z0-9-]+/)[0].substring(2)
				return `https://www.youtube-nocookie.com/embed/${video_id}`
			})
			.or(z.string().transform(() => null)),

		//
		//
		//
		//
		currency: z.enum(CURRENCY, { errorMap: () => ({ message: 'is_required' }) }),

		door_time: z.coerce
			.number()
			.min(0, { message: 'must_be_greater_than_0' })
			.max(180, { message: 'must_be_lower_than_180' }),

		timezone: z.enum(TIMEZONE, { errorMap: () => ({ message: 'is_required' }) }),

		calendar: z
			.array(
				z
					.object({
						adult_fee: z.coerce.number().gte(0),
						child_fee: z.coerce.number().gte(0),
						feature: z
							.array(z.enum(FEATURE))
							.transform((arr) => arr.sort())
							.or(z.null())
							.default(null),
						audio_lang: z
							.enum(LANG, { errorMap: () => ({ message: 'is_required' }) })
							.or(z.string().transform(() => null)),
						start: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { message: 'invalid_date_format' }),
						end: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, { message: 'invalid_date_format' })
					})
					.refine((object) => object.end > object.start, {
						message: 'start_must_be_before_end',
						path: ['start']
					})
					.refine((object) => object.start.startsWith(object.end.substring(0, 10), 0), {
						message: 'start_and_end_must_be_the_same_day',
						path: ['start']
					})
			)
			.min(1, { message: 'at_least_one_date' })
			.transform((array) => sort_calendar_by_start_date(array)),

		//
		//
		//
		//
		// Geography
		street: z
			.string()
			.min(4, { message: 'too_short_for_a_street' })
			.transform((s) => strip_multiple_spaces_and_emojis(s))
			.refine(
				(val) => {
					if (val === val.toUpperCase()) return false
					return true
				},
				{ message: 'must_not_be_all_caps' }
			),
		city: z
			.string()
			.min(2, { message: 'too_short_for_a_city' })
			.transform((s) => strip_multiple_spaces_and_emojis(s))
			.refine(
				(val) => {
					if (val === val.toUpperCase()) return false
					return true
				},
				{ message: 'must_not_be_all_caps' }
			),
		zipcode: z
			.string()
			.min(1, { message: 'too_short_for_a_zipcode' })
			.transform((s) => strip_multiple_spaces_and_emojis(s)),
		country: z.enum(COUNTRY, { errorMap: () => ({ message: 'is_required' }) }),

		longitude: z.union([
			z.coerce
				.number()
				.negative({ message: 'must_be_between_-180_and_180' })
				.min(-180, { message: 'must_be_between_-180_and_180' }),
			z.coerce
				.number()
				.positive({ message: 'must_be_between_-180_and_180' })
				.max(180, { message: 'must_be_between_-180_and_180' })
		]),
		latitude: z.union([
			z.coerce
				.number()
				.negative({ message: 'must_be_between_-90_and_90' })
				.min(-90, { message: 'must_be_between_-90_and_90' }),
			z.coerce
				.number()
				.positive({ message: 'must_be_between_-90_and_90' })
				.max(90, { message: 'must_be_between_-90_and_90' })
		]),

		//
		//
		//
		//
		type: z
			.array(z.enum(TYPE), { required_error: 'must_be_between_1_and_3' })
			.min(1, { message: 'must_be_between_1_and_3' })
			.max(3, { message: 'must_be_between_1_and_3' }),

		//
		//
		//
		//
		min_age: z
			.string()
			.transform((s) => {
				if (s === '') return 0
				return s
			})
			.or(z.number())
			.pipe(
				z.coerce
					.number()
					.min(0, { message: 'must_be_between_0_and_99' })
					.max(99, { message: 'must_be_between_0_and_99' })
			),

		max_age: z
			.string()
			.transform((s) => {
				if (s === '') return 99
				return s
			})
			.or(z.number())
			.pipe(
				z.coerce
					.number()
					.min(0, { message: 'must_be_between_0_and_99' })
					.max(99, { message: 'must_be_between_0_and_99' })
			)
	})

	//
	//
	//
	//
	// Final refinements
	.refine((object) => object.max_age > object.min_age, {
		message: 'max_age_must_be_greater_than_min_age',
		path: ['min_age']
	})
	.refine((object) => !(object.booking_medium === null && object.mandatory_booking === true), {
		message: 'if_booking_is_mandatory_do_propose_a_booking_medium',
		path: ['booking_medium']
	})
	.refine((object) => object.linked_to.includes(object.created_by), {
		message: 'must_contain_created_by_value',
		path: ['linked_to']
	})
	.refine(
		(object) =>
			object.booking_medium === null ||
			object.booking_medium?.map((m) => m.data).length ===
				[...new Set(object.booking_medium?.map((m) => m.data))].length
				? true
				: false,
		{
			message: 'booking_medium_cannot_be_identical',
			path: ['booking_medium']
		}
	)
	.refine(
		(object) =>
			object.calendar?.map((c) => c.start).length === [...new Set(object.calendar.map((c) => c.start))].length &&
			object.calendar?.map((c) => c.end).length === [...new Set(object.calendar.map((c) => c.end))].length
				? true
				: false,
		{
			message: 'no_calendar_can_start_or_end_at_the_same_time',
			path: ['calendar']
		}
	)

// eslint-disable-next-line no-redeclare
export type Event = z.infer<typeof Event>
