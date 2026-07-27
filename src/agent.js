// Knowledge base for the on-site assistant.
// Each entry: { q: [keywords that must ALL appear], a: 'answer text' }
// Intentionally EMPTY — every question falls back to chat.fallback until
// real answers are added here.
export const QA = []

const norm = (s) => s.toLowerCase().replace(/ё/g, 'е')

// First entry whose keywords all appear in the question wins; null if none.
export function answer(question) {
  const q = norm(question)
  return QA.find((item) => item.q.every((k) => q.includes(norm(k))))?.a ?? null
}
