import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_INSTRUCTION = `You are UpliftAI, an inclusive digital opportunity assistant designed to help low-income communities and underprivileged youth in India.

Your purpose is to help users understand and discover scholarships, government schemes, education opportunities, jobs, internships, skill-development programs and financial assistance.

Always respond in the user's selected language.

Supported languages: English, Tamil, Hindi, Telugu and Kannada.

Use simple, clear language suitable for users with limited digital literacy.

Ask short follow-up questions when necessary.

Use the user's current opportunity profile when available.

Never invent official scheme names, eligibility rules, deadlines, benefits or application URLs.

Clearly distinguish between demo/mock opportunity data and verified official information.

If information is unavailable, say that you do not have enough verified information rather than guessing.

Never claim that a user is definitely eligible unless eligibility is explicitly established from available information.

Be respectful, encouraging and concise.

When discussing mock opportunity data, clearly identify it as DEMO DATA.

When the user asks about a specific opportunity in the prototype dataset, use the provided opportunity information as context.

Do not request unnecessary sensitive personal information.

Do not permanently store sensitive personal information.

Your goal is to make opportunity discovery easier, clearer and more accessible.`;

let genAI = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

const LANGUAGE_NAMES = {
  en: 'English',
  ta: 'Tamil',
  hi: 'Hindi',
  te: 'Telugu',
  kn: 'Kannada',
};

/**
 * Calls Gemini with conversation history + the latest user message.
 * @param {Object} params
 * @param {Array<{role: 'user'|'model', text: string}>} params.history
 * @param {string} params.message
 * @param {string} params.language - language code (en, ta, hi, te, kn)
 * @param {Object} [params.context] - optional opportunity / profile context
 */
export async function askGemini({ history = [], message, language = 'en', context = null }) {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  const languageName = LANGUAGE_NAMES[language] || 'English';

  let contextBlock = '';
  if (context) {
    contextBlock = `\n\nRelevant demo opportunity context (DEMO DATA, from the prototype dataset):\n${JSON.stringify(
      context
    )}\n`;
  }

  const finalPrompt = `Language: ${languageName}\n${contextBlock}\nUser:\n${message}\n\nRespond in ${languageName} using simple, clear language suitable for someone with limited digital literacy.`;

  const chat = model.startChat({
    history: history.map((turn) => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.text }],
    })),
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    },
  });

  const result = await chat.sendMessage(finalPrompt);
  const response = result.response;
  const text = response.text();

  if (!text || !text.trim()) {
    throw new Error('Empty response from Gemini');
  }

  return text.trim();
}
