const API_BASE = window.location.origin;

export async function fetchDesign(storeId) {
  const res = await fetch(`${API_BASE}/api/design/${storeId}`);
  if (!res.ok) throw new Error(`Failed to fetch design: ${res.status}`);
  return res.json();
}

export async function saveDesign(storeId, token, design) {
  const res = await fetch(`${API_BASE}/api/design/${storeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify(design)
  });
  if (res.status === 401) throw new Error('unauthorized');
  if (res.status === 422) {
    const data = await res.json();
    throw new Error(`Validation: ${JSON.stringify(data.details)}`);
  }
  if (!res.ok) throw new Error(`Failed to save: ${res.status}`);
  return res.json();
}

export async function fetchDefaults(storeId) {
  const res = await fetch(`${API_BASE}/api/design/${storeId}/defaults`);
  return res.json();
}
