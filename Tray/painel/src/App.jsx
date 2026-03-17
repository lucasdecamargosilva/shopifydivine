import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import { fetchDesign, saveDesign, fetchDefaults } from './api';
import { DEFAULTS } from './defaults';

function getParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    storeId: params.get('store_id') || 'demo',
    token: params.get('token'),
    isDemo: !params.get('store_id')
  };
}

export default function App() {
  const { storeId, token: urlToken, isDemo } = getParams();
  const [token, setToken] = useState(urlToken || '');
  const [design, setDesign] = useState({
    photo_button: { ...DEFAULTS },
    buy_button: { ...DEFAULTS },
    button_mode: 'both'
  });
  const [savedDesign, setSavedDesign] = useState(null);
  const [activeButton, setActiveButton] = useState('photo_button');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const hasChanges = savedDesign && JSON.stringify(design) !== JSON.stringify(savedDesign);

  // postMessage token exchange
  useEffect(() => {
    if (token) return;
    const handler = (e) => {
      if (e.data?.type === 'provou-levou-token' && e.data.token) {
        setToken(e.data.token);
      }
    };
    window.addEventListener('message', handler);
    window.parent?.postMessage({ type: 'provou-levou-request-token' }, '*');
    const timeout = setTimeout(() => {
      window.removeEventListener('message', handler);
    }, 3000);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('message', handler);
    };
  }, [token]);

  // Load design
  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }
    fetchDesign(storeId)
      .then(data => {
        const merged = {
          photo_button: { ...DEFAULTS, ...data.photo_button },
          buy_button: { ...DEFAULTS, ...data.buy_button },
          button_mode: data.button_mode || 'both'
        };
        setDesign(merged);
        setSavedDesign(merged);
      })
      .catch(() => setError('Nao foi possivel carregar seu design'))
      .finally(() => setLoading(false));
  }, [storeId]);

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = 'Voce tem alteracoes nao salvas.';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasChanges]);

  const handleChange = useCallback((buttonKey, newButtonDesign) => {
    setDesign(prev => ({ ...prev, [buttonKey]: newButtonDesign }));
  }, []);

  const handleChangeMode = useCallback((mode) => {
    setDesign(prev => ({ ...prev, button_mode: mode }));
  }, []);

  async function handleSave() {
    if (isDemo) {
      setToast({ type: 'success', message: 'Modo demo: preview atualizado! Para salvar de verdade, acesse pelo admin da loja.' });
      setSavedDesign({ ...design });
      setTimeout(() => setToast(null), 4000);
      return;
    }
    if (!token) {
      setToast({ type: 'error', message: 'Sessao expirada, recarregue a pagina' });
      return;
    }
    setSaving(true);
    try {
      await saveDesign(storeId, token, design);
      setSavedDesign({ ...design });
      setToast({ type: 'success', message: 'Design salvo! As mudancas ja estao ativas na sua loja.' });
    } catch (err) {
      if (err.message === 'unauthorized') {
        setToast({ type: 'error', message: 'Sessao expirada, recarregue a pagina' });
      } else {
        setToast({ type: 'error', message: 'Falha ao salvar. Verifique sua conexao.' });
      }
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 4000);
    }
  }

  async function handleReset() {
    try {
      const data = await fetchDefaults(storeId);
      const merged = {
        photo_button: { ...DEFAULTS, ...data.photo_button },
        buy_button: { ...DEFAULTS, ...data.buy_button },
        button_mode: 'both'
      };
      setDesign(merged);
    } catch {
      setDesign({ photo_button: { ...DEFAULTS }, buy_button: { ...DEFAULTS }, button_mode: 'both' });
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin w-8 h-8 border-4 border-brand-purple border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-brand-light gap-4">
        <p className="text-brand-dark font-semibold">{error}</p>
        <button onClick={() => window.location.reload()}
          className="px-4 py-2 bg-brand-purple text-white rounded-lg font-semibold">
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Header onSave={handleSave} onReset={handleReset} hasChanges={hasChanges} saving={saving} />
      <div className="flex flex-1 overflow-hidden max-md:flex-col">
        <EditorPanel
          design={design}
          activeButton={activeButton}
          onChangeButton={setActiveButton}
          onChangeMode={handleChangeMode}
          onChange={handleChange}
        />
        <PreviewPanel design={design} activeButton={activeButton} onChangeMode={handleChangeMode} />
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-sm font-semibold z-50 transition-all ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
