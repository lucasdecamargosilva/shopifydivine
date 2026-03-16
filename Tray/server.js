const express = require('express');
const path = require('path');
const { setupDesignRoutes } = require('./routes/design');

const app = express();
const PORT = process.env.PORT || 3000;

// JSON body parsing (500KB limit for design payloads with base64 images)
app.use(express.json({ limit: '500kb' }));

// CORS - allowlist for credentialed requests
const ALLOWED_ORIGINS = [
  'https://lojista.provoulevou.com.br',
  /^https:\/\/.*\.tray\.com\.br$/,
  /^https:\/\/.*\.traycommerce\.com\.br$/
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const isAllowed = ALLOWED_ORIGINS.some(o =>
    typeof o === 'string' ? o === origin : o.test(origin || '')
  );

  if (isAllowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  } else if (origin) {
    // Public GET routes (provador-tray.js from any store) — no credentials
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Static: provador-tray.js (no-cache so stores always get latest version)
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 0,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

// Static: editor panel (built React app)
app.use('/painel', express.static(path.join(__dirname, 'painel', 'dist')));
// SPA fallback for React Router
app.get('/painel/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'painel', 'dist', 'index.html'));
});

// API routes
setupDesignRoutes(app);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));


app.listen(PORT, () => {
  console.log(`Provador Tray rodando na porta ${PORT}`);
});
