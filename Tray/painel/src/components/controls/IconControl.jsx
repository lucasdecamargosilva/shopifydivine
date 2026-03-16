import React, { useRef } from 'react';
import { ICON_OPTIONS } from '../../defaults';

function resizeImage(file, maxSize, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > maxSize || h > maxSize) {
        if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
        else { w = Math.round(w * maxSize / h); h = maxSize; }
      }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/png'));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

export default function IconControl({ design, onChange, activeButton }) {
  const fileRef = useRef(null);
  const isPhotoButton = activeButton === 'photo_button';
  const hasCustomImage = isPhotoButton && design.customButtonImage;

  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    resizeImage(file, 200, function(dataUrl) {
      onChange('customButtonImage', dataUrl);
    });
  }

  return (
    <div className="space-y-3">
      {isPhotoButton && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-brand-gray">Imagem personalizada do botao</label>
          <p className="text-[10px] text-brand-gray">Suba uma imagem pronta para usar como botao. Ela substituira o icone e estilo.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="px-3 py-1.5 text-xs font-semibold bg-brand-purple text-white rounded-md hover:opacity-90 transition"
            >
              Escolher imagem
            </button>
            {hasCustomImage && (
              <button
                onClick={() => onChange('customButtonImage', null)}
                className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-md hover:opacity-90 transition"
              >
                Remover
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          {hasCustomImage && (
            <div className="mt-2 flex justify-center">
              <img src={design.customButtonImage} alt="Preview" className="max-w-[80px] max-h-[80px] rounded border border-gray-200" />
            </div>
          )}
          {hasCustomImage && (
            <p className="text-[10px] text-green-600 font-medium">Imagem personalizada ativa — as opcoes abaixo ficam desativadas.</p>
          )}
        </div>
      )}
      {!hasCustomImage && (
        <>
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
              {activeButton === 'buy_button' && (
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
              )}
              <div>
                <label className="text-xs font-medium text-brand-gray">Tamanho: {design.iconSize}px</label>
                <input type="range" min={10} max={40} value={design.iconSize}
                  onChange={e => onChange('iconSize', Number(e.target.value))}
                  className="w-full accent-brand-purple" />
              </div>
              <div>
                <label className="text-xs font-medium text-brand-gray">Cor do icone</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={design.iconColor || '#000000'}
                    onChange={e => onChange('iconColor', e.target.value)}
                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs text-brand-gray">{design.iconColor || '#000000'}</span>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
