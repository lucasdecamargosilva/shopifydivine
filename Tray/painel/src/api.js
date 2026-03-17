const API_BASE = window.location.origin;

export async function fetchDesign(storeId) {
  const res = await fetch(`${API_BASE}/api/design/${storeId}`);
  if (!res.ok) throw new Error(`Failed to fetch design: ${res.status}`);
  return res.json();
}

export async function saveDesign(storeId, token, design) {
  // Strip customButtonImage from the payload — it's uploaded separately
  const cleanDesign = {
    photo_button: { ...design.photo_button },
    buy_button: { ...design.buy_button },
    button_mode: design.button_mode
  };
  delete cleanDesign.photo_button.customButtonImage;
  delete cleanDesign.buy_button.customButtonImage;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(`${API_BASE}/api/design/${storeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(cleanDesign),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.status === 401) throw new Error('unauthorized');
    if (res.status === 422) {
      const data = await res.json();
      throw new Error(`Validation: ${JSON.stringify(data.details)}`);
    }
    if (!res.ok) throw new Error(`Failed to save: ${res.status}`);
    return res.json();
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('Timeout: servidor nao respondeu');
    throw err;
  }
}

export async function uploadButtonImage(storeId, token, base64Data) {
  if (!base64Data) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(`${API_BASE}/api/design/${storeId}/image`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ image: base64Data }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.status === 401) throw new Error('unauthorized');
    if (!res.ok) throw new Error(`Failed to upload image: ${res.status}`);
    const data = await res.json();
    return data.url;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('Timeout: upload da imagem falhou');
    throw err;
  }
}

export async function deleteButtonImage(storeId, token) {
  const res = await fetch(`${API_BASE}/api/design/${storeId}/image`, {
    method: 'DELETE',
    headers: { 'Authorization': token }
  });
  if (!res.ok && res.status !== 404) throw new Error(`Failed to delete image: ${res.status}`);
}

export async function fetchDefaults(storeId) {
  const res = await fetch(`${API_BASE}/api/design/${storeId}/defaults`);
  return res.json();
}
