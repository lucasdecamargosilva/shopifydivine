const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

function supabase(path, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': options.prefer || '',
    ...options.headers
  };
  return fetch(url, { ...options, headers });
}

const DEFAULTS = {
  backgroundColor: '#ffffff',
  gradient: null,
  textColor: '#000000',
  borderColor: '#000000',
  borderRadius: 0,
  borderWidth: 1,
  width: '100%',
  height: 45,
  padding: '8px 16px',
  shadow: false,
  shadowIntensity: 0.15,
  label: 'Provador Virtual',
  fontFamily: 'Inter',
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 2,
  icon: 'cabine',
  iconPosition: 'left',
  iconSize: 20,
  iconCustomUrl: null,
  iconColor: '#000000',
  customButtonImage: null,
  hoverAnimation: 'none',
  badge: true,
  badgeText: 'Novidade!',
  customCSS: ''
};

const ENUMS = {
  icon: ['cabine', 'cabide', 'espelho', 'provador', 'custom', 'none'],
  iconPosition: ['left', 'right'],
  hoverAnimation: ['scale', 'glow', 'slide', 'shake', 'invert', 'none'],
  textTransform: ['uppercase', 'lowercase', 'capitalize', 'none'],
  fontWeight: [400, 500, 600, 700, 800],
  fontFamily: ['Inter', 'Roboto', 'Poppins', 'Montserrat', 'Open Sans', 'Lato', 'Playfair Display', 'Raleway'],
  buttonMode: ['image', 'buy', 'both'],
  gradientDirection: ['to right', 'to left', 'to bottom', 'to top', '45deg', '135deg']
};

const CSS_ALLOWED = new Set([
  'color', 'background-color', 'background', 'border', 'border-radius',
  'border-color', 'border-width', 'box-shadow', 'opacity', 'transform',
  'transition', 'font-size', 'font-weight', 'font-family', 'text-align',
  'text-decoration', 'letter-spacing', 'line-height', 'padding', 'margin',
  'width', 'height', 'max-width', 'min-width', 'display', 'gap',
  'align-items', 'justify-content'
]);

const CSS_BLOCKED_PATTERNS = [
  /url\s*\(/i, /expression\s*\(/i, /@import/i, /@charset/i,
  /behavior\s*:/i, /javascript\s*:/i, /-moz-binding/i,
  /position\s*:\s*fixed/i, /position\s*:\s*absolute/i
];

function sanitizeCSS(css) {
  if (!css || typeof css !== 'string') return '';
  for (const pattern of CSS_BLOCKED_PATTERNS) {
    css = css.replace(pattern, '/* blocked */');
  }
  return css.split(';').filter(rule => {
    const prop = rule.split(':')[0]?.trim().toLowerCase();
    return prop && CSS_ALLOWED.has(prop);
  }).join(';');
}

function validateButton(btn) {
  const errors = [];
  if (!btn || typeof btn !== 'object') return ['Button must be an object'];

  if (btn.label && btn.label.length > 50) errors.push('label max 50 chars');
  if (btn.fontSize !== undefined && (btn.fontSize < 8 || btn.fontSize > 24)) errors.push('fontSize must be 8-24');
  if (btn.borderRadius !== undefined && (btn.borderRadius < 0 || btn.borderRadius > 100)) errors.push('borderRadius must be 0-100');
  if (btn.borderWidth !== undefined && (btn.borderWidth < 0 || btn.borderWidth > 10)) errors.push('borderWidth must be 0-10');
  if (btn.height !== undefined && (btn.height < 30 || btn.height > 80)) errors.push('height must be 30-80');
  if (btn.iconSize !== undefined && (btn.iconSize < 10 || btn.iconSize > 40)) errors.push('iconSize must be 10-40');
  if (btn.letterSpacing !== undefined && (btn.letterSpacing < 0 || btn.letterSpacing > 10)) errors.push('letterSpacing must be 0-10');
  if (btn.shadowIntensity !== undefined && (btn.shadowIntensity < 0 || btn.shadowIntensity > 1)) errors.push('shadowIntensity must be 0-1');
  if (btn.badgeText && btn.badgeText.length > 30) errors.push('badgeText max 30 chars');
  if (btn.customCSS && btn.customCSS.length > 2000) errors.push('customCSS max 2000 chars');
  if (btn.iconCustomUrl && btn.iconCustomUrl.length > 500) errors.push('iconCustomUrl max 500 chars');
  if (btn.iconCustomUrl && !btn.iconCustomUrl.startsWith('https://')) errors.push('iconCustomUrl must start with https://');
  if (btn.customButtonImage && typeof btn.customButtonImage === 'string' && btn.customButtonImage.length > 300000) errors.push('customButtonImage max 300KB');
  if (btn.customButtonImage && typeof btn.customButtonImage === 'string' && !btn.customButtonImage.startsWith('data:image/')) errors.push('customButtonImage must be a data:image URI');

  if (btn.icon && !ENUMS.icon.includes(btn.icon)) errors.push('invalid icon value');
  if (btn.iconPosition && !ENUMS.iconPosition.includes(btn.iconPosition)) errors.push('invalid iconPosition');
  if (btn.hoverAnimation && !ENUMS.hoverAnimation.includes(btn.hoverAnimation)) errors.push('invalid hoverAnimation');
  if (btn.textTransform && !ENUMS.textTransform.includes(btn.textTransform)) errors.push('invalid textTransform');
  if (btn.fontWeight !== undefined && !ENUMS.fontWeight.includes(btn.fontWeight)) errors.push('invalid fontWeight');
  if (btn.fontFamily && !ENUMS.fontFamily.includes(btn.fontFamily)) errors.push('invalid fontFamily');

  if (btn.gradient && typeof btn.gradient === 'object') {
    if (!ENUMS.gradientDirection.includes(btn.gradient.direction)) errors.push('invalid gradient direction');
    if (!Array.isArray(btn.gradient.colors) || btn.gradient.colors.length !== 2) errors.push('gradient.colors must be array of 2 hex colors');
  }

  return errors;
}

async function authenticate(req, storeId) {
  const apiKey = req.headers.authorization;
  if (!apiKey) return false;
  // Hash the API key client-side and compare with stored hash
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const resp = await supabase(
    `provou_levou_stores?store_id=eq.${encodeURIComponent(storeId)}&api_key_hash=eq.${encodeURIComponent(hash)}&select=store_id`,
    { headers: { 'Accept': 'application/json' } }
  );
  if (!resp.ok) return false;
  const rows = await resp.json();
  return rows.length > 0;
}

function setupDesignRoutes(app) {
  // GET design (public - used by provador-tray.js)
  app.get('/api/design/:store_id', async (req, res) => {
    try {
      const { store_id } = req.params;
      const resp = await supabase(
        `store_designs?store_id=eq.${encodeURIComponent(store_id)}&select=photo_button,buy_button,button_mode,version,custom_image,custom_logo`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (!resp.ok) {
        const err = await resp.text();
        console.error('Supabase GET error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      const rows = await resp.json();
      if (rows.length === 0) {
        return res.json({ photo_button: DEFAULTS, buy_button: DEFAULTS, button_mode: 'both', version: 1 });
      }
      const row = rows[0];
      const photoBtn = { ...DEFAULTS, ...row.photo_button };
      // Merge custom_image from separate column into photo_button
      if (row.custom_image) {
        photoBtn.customButtonImage = row.custom_image;
      }
      res.set('Cache-Control', 'public, max-age=300');
      res.json({
        photo_button: photoBtn,
        buy_button: { ...DEFAULTS, ...row.buy_button },
        button_mode: row.button_mode,
        version: row.version,
        custom_logo: row.custom_logo || null
      });
    } catch (err) {
      console.error('GET /api/design error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET defaults (public)
  app.get('/api/design/:store_id/defaults', (req, res) => {
    res.json({ photo_button: DEFAULTS, buy_button: DEFAULTS, button_mode: 'both', version: 1 });
  });

  // POST design (authenticated)
  app.post('/api/design/:store_id', async (req, res) => {
    try {
      const { store_id } = req.params;

      const authenticated = await authenticate(req, store_id);
      if (!authenticated) return res.status(401).json({ error: 'Unauthorized' });

      const { photo_button, buy_button, button_mode } = req.body;

      if (button_mode && !ENUMS.buttonMode.includes(button_mode)) {
        return res.status(422).json({ error: 'Invalid button_mode', details: ['must be image, buy, or both'] });
      }

      const photoErrors = validateButton(photo_button);
      const buyErrors = validateButton(buy_button);
      if (photoErrors.length || buyErrors.length) {
        return res.status(422).json({
          error: 'Validation failed',
          details: { photo_button: photoErrors, buy_button: buyErrors }
        });
      }

      // Sanitize customCSS
      if (photo_button?.customCSS) photo_button.customCSS = sanitizeCSS(photo_button.customCSS);
      if (buy_button?.customCSS) buy_button.customCSS = sanitizeCSS(buy_button.customCSS);

      const body = {
        photo_button: photo_button || DEFAULTS,
        buy_button: buy_button || DEFAULTS,
        button_mode: button_mode || 'both'
      };

      // Try PATCH first (update existing), fall back to POST (insert new)
      let resp = await supabase(
        `store_designs?store_id=eq.${encodeURIComponent(store_id)}`,
        {
          method: 'PATCH',
          prefer: 'return=representation',
          body: JSON.stringify(body),
          headers: { 'Accept': 'application/json' }
        }
      );

      if (resp.ok) {
        const rows = await resp.json();
        if (rows.length === 0) {
          // No existing record, insert
          resp = await supabase('store_designs', {
            method: 'POST',
            prefer: 'return=representation',
            body: JSON.stringify({ store_id, ...body }),
            headers: { 'Accept': 'application/json' }
          });
          if (!resp.ok) {
            const err = await resp.text();
            console.error('Supabase POST error:', err);
            return res.status(500).json({ error: 'Internal server error' });
          }
          const newRows = await resp.json();
          return res.json({ success: true, version: newRows[0]?.version || 1 });
        }
        return res.json({ success: true, version: rows[0]?.version || 1 });
      }

      const err = await resp.text();
      console.error('Supabase PATCH error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    } catch (err) {
      console.error('POST /api/design error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  // PUT custom image (authenticated, separate from design save)
  app.put('/api/design/:store_id/image', async (req, res) => {
    try {
      const { store_id } = req.params;
      const authenticated = await authenticate(req, store_id);
      if (!authenticated) return res.status(401).json({ error: 'Unauthorized' });

      const { image } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(422).json({ error: 'Missing image data' });
      }
      if (!image.startsWith('data:image/')) {
        return res.status(422).json({ error: 'Image must be a data:image URI' });
      }
      if (image.length > 500000) {
        return res.status(422).json({ error: 'Image too large (max 500KB)' });
      }

      // Try PATCH first, then POST if no row exists
      let resp = await supabase(
        `store_designs?store_id=eq.${encodeURIComponent(store_id)}`,
        {
          method: 'PATCH',
          prefer: 'return=representation',
          body: JSON.stringify({ custom_image: image }),
          headers: { 'Accept': 'application/json' }
        }
      );

      if (resp.ok) {
        const rows = await resp.json();
        if (rows.length === 0) {
          resp = await supabase('store_designs', {
            method: 'POST',
            prefer: 'return=representation',
            body: JSON.stringify({ store_id, custom_image: image }),
            headers: { 'Accept': 'application/json' }
          });
          if (!resp.ok) {
            console.error('Supabase image POST error:', await resp.text());
            return res.status(500).json({ error: 'Internal server error' });
          }
        }
        return res.json({ success: true, url: 'stored' });
      }

      console.error('Supabase image PATCH error:', await resp.text());
      return res.status(500).json({ error: 'Internal server error' });
    } catch (err) {
      console.error('PUT /api/design/image error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE custom image (authenticated)
  app.delete('/api/design/:store_id/image', async (req, res) => {
    try {
      const { store_id } = req.params;
      const authenticated = await authenticate(req, store_id);
      if (!authenticated) return res.status(401).json({ error: 'Unauthorized' });

      await supabase(
        `store_designs?store_id=eq.${encodeURIComponent(store_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ custom_image: null }),
          headers: { 'Accept': 'application/json' }
        }
      );

      return res.json({ success: true });
    } catch (err) {
      console.error('DELETE /api/design/image error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT custom logo (authenticated)
  app.put('/api/design/:store_id/logo', async (req, res) => {
    try {
      const { store_id } = req.params;
      const authenticated = await authenticate(req, store_id);
      if (!authenticated) return res.status(401).json({ error: 'Unauthorized' });

      const { image } = req.body;
      if (!image || typeof image !== 'string') {
        return res.status(422).json({ error: 'Missing image data' });
      }
      if (!image.startsWith('data:image/')) {
        return res.status(422).json({ error: 'Logo must be a data:image URI' });
      }
      if (image.length > 500000) {
        return res.status(422).json({ error: 'Logo too large (max 500KB)' });
      }

      let resp = await supabase(
        `store_designs?store_id=eq.${encodeURIComponent(store_id)}`,
        {
          method: 'PATCH',
          prefer: 'return=representation',
          body: JSON.stringify({ custom_logo: image }),
          headers: { 'Accept': 'application/json' }
        }
      );

      if (resp.ok) {
        const rows = await resp.json();
        if (rows.length === 0) {
          resp = await supabase('store_designs', {
            method: 'POST',
            prefer: 'return=representation',
            body: JSON.stringify({ store_id, custom_logo: image }),
            headers: { 'Accept': 'application/json' }
          });
          if (!resp.ok) {
            console.error('Supabase logo POST error:', await resp.text());
            return res.status(500).json({ error: 'Internal server error' });
          }
        }
        return res.json({ success: true });
      }

      console.error('Supabase logo PATCH error:', await resp.text());
      return res.status(500).json({ error: 'Internal server error' });
    } catch (err) {
      console.error('PUT /api/design/logo error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE custom logo (authenticated)
  app.delete('/api/design/:store_id/logo', async (req, res) => {
    try {
      const { store_id } = req.params;
      const authenticated = await authenticate(req, store_id);
      if (!authenticated) return res.status(401).json({ error: 'Unauthorized' });

      await supabase(
        `store_designs?store_id=eq.${encodeURIComponent(store_id)}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ custom_logo: null }),
          headers: { 'Accept': 'application/json' }
        }
      );

      return res.json({ success: true });
    } catch (err) {
      console.error('DELETE /api/design/logo error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}

module.exports = { setupDesignRoutes, DEFAULTS };
