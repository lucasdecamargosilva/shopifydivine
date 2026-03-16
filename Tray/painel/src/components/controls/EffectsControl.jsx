import React from 'react';
import { ANIMATION_OPTIONS } from '../../defaults';

export default function EffectsControl({ design, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-brand-gray">Animacao no hover</label>
        <select
          value={design.hoverAnimation}
          onChange={e => onChange('hoverAnimation', e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
        >
          {ANIMATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-brand-gray">Badge "Novidade"</label>
        <button
          onClick={() => onChange('badge', !design.badge)}
          className={`w-10 h-5 rounded-full transition ${design.badge ? 'bg-brand-purple' : 'bg-gray-300'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${design.badge ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {design.badge && (
        <div>
          <label className="text-xs font-medium text-brand-gray">Texto do badge</label>
          <input
            type="text"
            value={design.badgeText}
            maxLength={30}
            onChange={e => onChange('badgeText', e.target.value)}
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
          />
        </div>
      )}
    </div>
  );
}
