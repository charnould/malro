// Very rough idea
//
// If a GitHub user is a *Spam Corps* member
// and GitHub Action is `labeled`
// and `label.name` is `spam:yes`,
// then, all events are marked as `spam`
// and will be permanently deleted from DB in 10 dans (with daily DP purge)

// If a GitHub user is a *Spam Corps* member
// and GitHub Action is `labeled`
// and `label.name` is `spam:pending`,
// then, all events are marked as `pending`
// and MALRO user must modify its events to not be considered as spam

export const handle_spam = () => null
