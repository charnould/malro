import type { Event } from '../../schema/event'

export const dummy_event: Event = {
	description: [
		{
			content:
				"Some content that must be at least 50 character-long, otherwise it's not considered as a valid description............................................",
			title: 'A title that must be at least 15 character-long',
			url: 'https://www.malro.org?lang=en',
			organizer: 'An organizer',
			detail: 'Some details',
			lang: 'en'
		},
		{
			content:
				"Du contenu qui doit être au minimum de 50 caractères (sinon cela n'est pas considéré comme une description valide.....................................",
			title: "Un titre d'au moins 15 caratères",
			url: 'https://www.malro.org?lang=fr',
			organizer: 'Un organisateur',
			detail: 'Des détails',
			lang: 'fr'
		}
	],
	calendar: [
		{
			feature: ['sign_language', 'relax'],
			start: '2023-01-01T19:00',
			end: '2023-01-01T22:30',
			audio_lang: 'fr',
			adult_fee: 20,
			child_fee: 10
		},
		{
			start: '2030-10-01T19:30',
			end: '2030-10-01T21:00',
			audio_lang: 'fr',
			feature: null,
			adult_fee: 15,
			child_fee: 5
		},
		{
			start: '2100-06-12T12:30',
			end: '2100-06-12T14:30',
			audio_lang: 'fr',
			child_fee: 10,
			adult_fee: 35,
			feature: null
		}
	],
	booking_medium: [
		{ allows_affiliate_partnership: true, data: 'https://www.malro.org', type: 'url' },
		{ data: 'on site (08:00 PM)', type: 'string' },
		{ data: 'contact@malro.org', type: 'email' },
		{ data: '+33 (0)4 21 80 00 00', type: 'phone' }
	],
	featuring: [
		{ firstname: 'Steve', lastname: 'Jobs' },
		{ lastname: 'Wozniak', firstname: 'Steve' }
	],
	image_url: 'https://www.malro.org/datastore/images/29b4981c-dad6-4908-9805-8bbcbbb8f706.webp',
	video_url: 'https://www.youtube.com/watch?v=f7TCuxfEitw',
	id: '29b4981c-dad6-4908-9805-8bbcbbb8f706',
	linked_to: ['malro.org', 'example.org'],
	updated_at: '2023-08-01T12:13:05.479Z',
	support_phone: '+33 (6) 11 45 67 98',
	support_email: 'contact@malro.org',
	booking_start: '2023-06-01T08:00',
	type: ['architecture', 'archive'],
	latitude: 45.0113182067871,
	longitude: 4.4113402366638,
	timezone: 'Europe/Paris',
	mandatory_booking: true,
	created_by: 'malro.org',
	status: 'published',
	street: 'A street',
	zipcode: '84140',
	currency: 'EUR',
	city: 'Avignon',
	door_time: 30,
	country: 'FR',
	max_age: 99,
	min_age: 0
}
