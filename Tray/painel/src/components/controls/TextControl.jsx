import React from 'react';
import { FONT_OPTIONS } from '../../defaults';

export default function TextControl({ design, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-brand-gray">Texto do botao</label>
        <input
          type="text"
          value={design.label}
          maxLength={50}
          onChange={e => onChange('label', e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Fonte</label>
        <select
          value={design.fontFamily}
          onChange={e => onChange('fontFamily', e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
        >
          {FONT_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Tamanho: {design.fontSize}px</label>
        <input type="range" min={8} max={24} value={design.fontSize}
          onChange={e => onChange('fontSize', Number(e.target.value))}
          className="w-full accent-brand-purple" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Peso</label>
        <select
          value={design.fontWeight}
          onChange={e => onChange('fontWeight', Number(e.target.value))}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
        >
          {[400, 500, 600, 700, 800].map(w => (
            <option key={w} value={w}>{w === 400 ? 'Normal' : w === 700 ? 'Bold' : w}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Caixa</label>
        <select
          value={design.textTransform}
          onChange={e => onChange('textTransform', e.target.value)}
          className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded"
        >
          <option value="uppercase">MAIUSCULAS</option>
          <option value="lowercase">minusculas</option>
          <option value="capitalize">Capitalizar</option>
          <option value="none">Normal</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Espacamento: {design.letterSpacing}px</label>
        <input type="range" min={0} max={10} value={design.letterSpacing}
          onChange={e => onChange('letterSpacing', Number(e.target.value))}
          className="w-full accent-brand-purple" />
      </div>
    </div>
  );
}
