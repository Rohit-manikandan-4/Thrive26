import { Router } from 'express';
import { askGemini } from '../services/gemini.js';

const router = Router();

const SUPPORTED_LANGUAGES = ['en', 'ta', 'hi', 'te', 'kn'];

router.post('/', async (req, res) => {
  try {
    const { message, language, history, context } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A message is required.' });
    }

    const safeLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';
    const safeHistory = Array.isArray(history) ? history.slice(-20) : [];

    const reply = await askGemini({
      history: safeHistory,
      message: message.trim().slice(0, 4000),
      language: safeLanguage,
      context: context || null,
    });

    res.json({ reply });
  } catch (err) {
    console.error('[UpliftAI backend] /api/chat error:', err.message);
    res.status(502).json({
      error: 'UpliftAI is temporarily unavailable. Please try again.',
    });
  }
});

export default router;
