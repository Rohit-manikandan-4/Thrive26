// Talks to the UpliftAI backend, which securely proxies to Google Gemini.
// The Gemini API key is never present in frontend code.

export async function sendChatMessage({ message, language, history, context }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, history, context }),
  });

  if (!res.ok) {
    let errorMessage = 'UpliftAI is temporarily unavailable. Please try again.';
    try {
      const data = await res.json();
      if (data?.error) errorMessage = data.error;
    } catch {
      /* ignore parse errors */
    }
    const err = new Error(errorMessage);
    err.isChatError = true;
    throw err;
  }

  const data = await res.json();
  return data.reply;
}
