// Wordmark in the navbar / footer / copyright.
export const BRAND = 'Studio'

// Booking backend = the shared "Booking Hub" (your Telegram-sign-up-bot).
// The Hub URL is public (not a secret), so it lives here in the static build.
//
// ▸ Paste your deployed Hub URL below (e.g. the Render Web Service URL).
//   It must NOT end with a slash.
export const HUB_URL = 'https://telegram-sign-up-bot.onrender.com'

// This site's tenant id in the Hub's server/tenants.js — must be registered
// there, otherwise the booking form returns an error.
export const TENANT = 'studio'

// Bookable start times — must match the Hub's TIME_SLOTS (server/google-calendar.js)
export const TIME_SLOTS = ['10:00', '12:00', '14:00', '16:00', '18:00']
