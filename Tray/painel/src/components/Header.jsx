import React from 'react';

const LOGO_URL = 'https://i.ibb.co/Xr64mxDS/logo-provou-levou-sem-fundo.png';

export default function Header({ onSave, onReset, hasChanges, saving }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      <img src={LOGO_URL} alt="Provou Levou" className="h-8" />
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-semibold text-brand-gray border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          Resetar
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className={`px-6 py-2 text-sm font-bold rounded-lg transition ${
            hasChanges
              ? 'bg-brand-purple text-white animate-pulse'
              : 'bg-brand-purple/90 text-white'
          } hover:bg-brand-purple disabled:opacity-50`}
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </header>
  );
}
