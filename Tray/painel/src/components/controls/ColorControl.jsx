import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';

function ColorField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-brand-gray">{label}</label>
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          style={{ backgroundColor: value }}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded font-mono"
        />
      </div>
      {open && (
        <div className="mt-2">
          <HexColorPicker color={value} onChange={onChange} />
        </div>
      )}
    </div>
  );
}

export default function ColorControl({ design, onChange }) {
  const hasGradient = !!design.gradient;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-xs font-medium text-brand-gray">Fundo gradiente</label>
        <button
          onClick={() => onChange('gradient', hasGradient ? null : { direction: 'to right', colors: ['#7B2FF2', '#C846E3'] })}
          className={`w-10 h-5 rounded-full transition ${hasGradient ? 'bg-brand-purple' : 'bg-gray-300'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${hasGradient ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {hasGradient ? (
        <>
          <div className="mb-3">
            <label className="text-xs font-medium text-brand-gray">Direcao</label>
            <select value={design.gradient.direction} onChange={e => onChange('gradient', { ...design.gradient, direction: e.target.value })}
              className="w-full mt-1 px-3 py-2 text-sm border border-gray-300 rounded">
              {['to right','to left','to bottom','to top','45deg','135deg'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <ColorField label="Cor 1" value={design.gradient.colors[0]} onChange={v => onChange('gradient', { ...design.gradient, colors: [v, design.gradient.colors[1]] })} />
          <ColorField label="Cor 2" value={design.gradient.colors[1]} onChange={v => onChange('gradient', { ...design.gradient, colors: [design.gradient.colors[0], v] })} />
        </>
      ) : (
        <ColorField label="Cor de fundo" value={design.backgroundColor} onChange={v => onChange('backgroundColor', v)} />
      )}
      <ColorField label="Cor do texto" value={design.textColor} onChange={v => onChange('textColor', v)} />
      <ColorField label="Cor da borda" value={design.borderColor} onChange={v => onChange('borderColor', v)} />
    </div>
  );
}
