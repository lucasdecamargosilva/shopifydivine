import React from 'react';

export default function AdvancedControl({ design, onChange }) {
  return (
    <div>
      <label className="text-xs font-medium text-brand-gray">CSS Customizado</label>
      <p className="text-[10px] text-brand-gray mt-1 mb-2">
        Propriedades CSS extras. Ex: box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      </p>
      <textarea
        value={design.customCSS}
        onChange={e => onChange('customCSS', e.target.value)}
        maxLength={2000}
        rows={6}
        placeholder="box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
        className="w-full px-3 py-2 text-xs font-mono border border-gray-300 rounded resize-y"
      />
      <p className="text-[10px] text-brand-gray mt-1">{design.customCSS.length}/2000</p>
    </div>
  );
}
