import React, { useState } from 'react';
import FakeProductPage from './preview/FakeProductPage';

export default function PreviewPanel({ design, activeButton, onChangeMode }) {
  const [viewport, setViewport] = useState('desktop');

  return (
    <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
      {/* Toolbar: viewport toggle + button mode */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          {['desktop', 'mobile'].map(v => (
            <button
              key={v}
              onClick={() => setViewport(v)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition ${
                viewport === v
                  ? 'bg-brand-purple text-white'
                  : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
              }`}
            >
              {v === 'desktop' ? '\u{1F5A5} Desktop' : '\u{1F4F1} Mobile'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-brand-dark uppercase tracking-wide">Onde exibir:</span>
          {[
            { value: 'image', label: 'Foto' },
            { value: 'buy', label: 'Compra' },
            { value: 'both', label: 'Ambos' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onChangeMode(opt.value)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                design.button_mode === opt.value
                  ? 'bg-brand-purple text-white'
                  : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        <div style={{ width: viewport === 'mobile' ? '375px' : '100%', maxWidth: '420px', transition: 'width 0.3s' }}>
          <FakeProductPage design={design} activeButton={activeButton} />
        </div>
      </div>
    </div>
  );
}
