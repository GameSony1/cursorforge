import { fileURLToPath } from 'node:url';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import { SKIN_CATALOG } from './catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/skins', (_req, res) => {
  res.json(SKIN_CATALOG);
});

app.get('/api/skins/:id', (req, res) => {
  const skin = SKIN_CATALOG.find((s) => s.id === req.params.id);
  if (!skin) {
    res.status(404).json({ error: 'skin not found' });
    return;
  }
  res.json(skin);
});

app.listen(PORT, () => {
  console.log(`[cursor-customizer] skin server listening on http://localhost:${PORT}`);
});
