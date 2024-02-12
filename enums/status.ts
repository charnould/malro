export const STATUS = [
	// Def: This event is a draft and must NOT be visible to public
	// This type of event is only stored in users.db which is NOT public
	'drafted',

	// Def: This event has been published by its creator and can be displayed to public
	'published',

	// Def: This event has been trashed **by its creator**
	// MALRO will automatically delete it from DB in a few days
	// Trashed events MUST NOT be displayed to public
	'trashed',

	// Def: This event has been trashed **by MALRO**
	// MALRO will automatically delete it from DB in a few days
	// Spam events MUST NOT be displayed to public
	'spam',

	// Def: MALRO considers this published event as a POSSIBLE SPAM or a NOT WELL-WRITTEN event
	// Pending events MUST NOT be displayed to public
	'pending'
] as const
