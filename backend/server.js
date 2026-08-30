import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'upliftai-backend' });
});

app.use('/api/chat', chatRouter);

// Generic error handler - never leak internal details to the client.
app.use((err, _req, res, _next) => {
  console.error('[UpliftAI backend] Unhandled error:', err);
  res.status(500).json({
    error: 'UpliftAI is temporarily unavailable. Please try again.',
  });
});

app.listen(PORT, () => {
  console.log(`UpliftAI backend listening on port ${PORT}`);
});
