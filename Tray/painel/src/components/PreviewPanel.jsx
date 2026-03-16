import React, { useState } from 'react';
import FakeProductPage from './preview/FakeProductPage';

export default function PreviewPanel({ design, activeButton }) {
  const [viewport, setViewport] = useState('desktop');

  return (
    <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
      {/* Viewport toggle */}
      <div className="flex items-center justify-center gap-2 py-3 bg-white border-b border-gray-200">
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

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        <div style={{ width: viewport === 'mobile' ? '375px' : '100%', maxWidth: '420px', transition: 'width 0.3s' }}>
          <FakeProductPage design={design} activeButton={activeButton} />
        </div>
      </div>
    </div>
  );
}
