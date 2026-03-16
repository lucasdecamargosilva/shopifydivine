import React from 'react';
import { ICON_OPTIONS } from '../../defaults';

export default function IconControl({ design, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-brand-gray">Icone</label>
        <select
          value={design.icon}
          onChange={e => onChange('icon', e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
        >
          {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      {design.icon === 'custom' && (
        <div>
          <label className="text-xs font-medium text-brand-gray">URL do icone (https://)</label>
          <input
            type="url"
            value={design.iconCustomUrl || ''}
            onChange={e => onChange('iconCustomUrl', e.target.value)}
            placeholder="https://exemplo.com/icone.png"
            className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
          />
        </div>
      )}
      {design.icon !== 'none' && (
        <>
          <div>
            <label className="text-xs font-medium text-brand-gray">Posicao</label>
            <div className="flex gap-2 mt-1">
              {['left', 'right'].map(pos => (
                <button
                  key={pos}
                  onClick={() => onChange('iconPosition', pos)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
                    design.iconPosition === pos
                      ? 'bg-brand-purple text-white'
                      : 'bg-gray-100 text-brand-gray hover:bg-gray-200'
                  }`}
                >
                  {pos === 'left' ? 'Esquerda' : 'Direita'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-brand-gray">Tamanho: {design.iconSize}px</label>
            <input type="range" min={10} max={40} value={design.iconSize}
              onChange={e => onChange('iconSize', Number(e.target.value))}
              className="w-full accent-brand-purple" />
          </div>
        </>
      )}
    </div>
  );
}
