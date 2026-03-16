import React from 'react';

export default function ShapeControl({ design, onChange }) {
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-brand-gray">Borda arredondada: {design.borderRadius}px</label>
        <input type="range" min={0} max={100} value={design.borderRadius}
          onChange={e => onChange('borderRadius', Number(e.target.value))}
          className="w-full accent-brand-purple" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Espessura da borda: {design.borderWidth}px</label>
        <input type="range" min={0} max={10} value={design.borderWidth}
          onChange={e => onChange('borderWidth', Number(e.target.value))}
          className="w-full accent-brand-purple" />
      </div>
      <div>
        <label className="text-xs font-medium text-brand-gray">Altura: {design.height}px</label>
        <input type="range" min={30} max={80} value={design.height}
          onChange={e => onChange('height', Number(e.target.value))}
          className="w-full accent-brand-purple" />
      </div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-brand-gray">Sombra</label>
        <button
          onClick={() => onChange('shadow', !design.shadow)}
          className={`w-10 h-5 rounded-full transition ${design.shadow ? 'bg-brand-purple' : 'bg-gray-300'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${design.shadow ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>
      {design.shadow && (
        <div>
          <label className="text-xs font-medium text-brand-gray">Intensidade: {design.shadowIntensity}</label>
          <input type="range" min={0} max={100} value={design.shadowIntensity * 100}
            onChange={e => onChange('shadowIntensity', Number(e.target.value) / 100)}
            className="w-full accent-brand-purple" />
        </div>
      )}
    </div>
  );
}
