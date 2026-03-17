import React, { useState, useRef } from 'react';
import ColorControl from './controls/ColorControl';
import TextControl from './controls/TextControl';
import ShapeControl from './controls/ShapeControl';
import IconControl from './controls/IconControl';
import EffectsControl from './controls/EffectsControl';
import AdvancedControl from './controls/AdvancedControl';
import BuyButton from './preview/BuyButton';

const CABINE_IMG_URL = 'https://i.ibb.co/50TPgYj/cabine-icone-oficial.png';

const ANIM_STYLES = {
  scale: { animation: 'mc-pulse-scale 2s ease-in-out infinite' },
  glow: { animation: 'mc-glow 2s ease-in-out infinite' },
  slide: { animation: 'mc-float 3s ease-in-out infinite' },
  shake: { animation: 'mc-shake 3s infinite' },
  none: {}
};

function MiniPhotoButton({ design }) {
  const hasCustomImage = !!design.customButtonImage;

  if (hasCustomImage) {
    return (
      <div style={{
        width: `${design.height || 60}px`,
        height: `${design.height || 60}px`,
        ...(ANIM_STYLES[design.hoverAnimation] || {}),
      }}>
        <img src={design.customButtonImage} alt="Botao" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    );
  }

  const bgStyle = design.gradient
    ? { background: `linear-gradient(${design.gradient.direction}, ${design.gradient.colors[0]}, ${design.gradient.colors[1]})` }
    : { backgroundColor: design.backgroundColor };

  const showIcon = design.icon !== 'none';
  const isCustomIcon = design.icon === 'custom' && design.iconCustomUrl;

  return (
    <div style={{
      ...bgStyle,
      border: `${design.borderWidth}px solid ${design.borderColor}`,
      borderRadius: `${design.borderRadius}px`,
      width: `${design.height || 60}px`,
      height: `${design.height || 60}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      boxShadow: design.shadow ? `0 4px 12px rgba(0,0,0,${design.shadowIntensity})` : 'none',
      ...(ANIM_STYLES[design.hoverAnimation] || {}),
    }}>
      {showIcon && (
        <div style={{
          width: design.iconSize,
          height: design.iconSize,
          backgroundColor: design.iconColor || '#000000',
          WebkitMaskImage: `url(${isCustomIcon ? design.iconCustomUrl : CABINE_IMG_URL})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(${isCustomIcon ? design.iconCustomUrl : CABINE_IMG_URL})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }} />
      )}
    </div>
  );
}

const SECTIONS = [
  { id: 'colors', label: 'Cores', icon: '\u{1F3A8}', Component: ColorControl },
  { id: 'text', label: 'Texto', icon: '\u{270F}\u{FE0F}', Component: TextControl, onlyFor: 'buy_button' },
  { id: 'shape', label: 'Forma', icon: '\u{2B1C}', Component: ShapeControl },
  { id: 'icon', label: 'Icone', icon: '\u{2B50}', Component: IconControl },
  { id: 'effects', label: 'Efeitos', icon: '\u{2728}', Component: EffectsControl },
  { id: 'advanced', label: 'Avancado', icon: '\u{2699}\u{FE0F}', Component: AdvancedControl },
];

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

export default function EditorPanel({ design, activeButton, onChangeButton, onChange, onChangeLogo }) {
  const [openSection, setOpenSection] = useState('colors');
  const logoFileRef = useRef(null);
  const buttonDesign = design[activeButton];

  function handleChange(field, value) {
    onChange(activeButton, { ...buttonDesign, [field]: value });
  }

  function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    resizeImage(file, 300, (dataUrl) => onChangeLogo(dataUrl));
  }

  return (
    <div className="w-80 bg-brand-light border-r border-gray-200 overflow-y-auto h-full flex flex-col">
      {/* Button tabs */}
      <div className="flex border-b border-gray-200">
        {['photo_button', 'buy_button'].map(key => (
          <button
            key={key}
            onClick={() => onChangeButton(key)}
            className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition ${
              activeButton === key
                ? 'text-brand-purple border-b-2 border-brand-purple bg-white'
                : 'text-brand-gray hover:text-brand-dark'
            }`}
          >
            {key === 'photo_button' ? 'Botao Foto' : 'Botao Compra'}
          </button>
        ))}
      </div>

      {/* Live mini-preview */}
      <div className="p-4 bg-white border-b border-gray-200">
        <label className="text-[10px] font-semibold text-brand-gray uppercase tracking-wider mb-2 block">Preview ao vivo</label>
        <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[80px]">
          {activeButton === 'buy_button' ? (
            <BuyButton design={buttonDesign} isActive={false} />
          ) : (
            <MiniPhotoButton design={buttonDesign} />
          )}
        </div>
      </div>

      {/* Logo do Provador */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => setOpenSection(openSection === 'logo' ? null : 'logo')}
          className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-brand-dark hover:bg-white transition"
        >
          <span>{'\u{1F3F7}\u{FE0F}'}</span>
          <span>Logo do Provador</span>
          <span className="ml-auto text-brand-gray">{openSection === 'logo' ? '\u2212' : '+'}</span>
        </button>
        {openSection === 'logo' && (
          <div className="px-4 pb-4 space-y-2">
            <p className="text-[10px] text-brand-gray">Logo exibido dentro do provador virtual, abaixo do titulo. Substitui o logo padrao da Provou Levou.</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => logoFileRef.current?.click()}
                className="px-3 py-1.5 text-xs font-semibold bg-brand-purple text-white rounded-md hover:opacity-90 transition"
              >
                Escolher logo
              </button>
              {design.custom_logo && (
                <button
                  onClick={() => onChangeLogo(null)}
                  className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-md hover:opacity-90 transition"
                >
                  Remover
                </button>
              )}
            </div>
            <input ref={logoFileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            {design.custom_logo && (
              <div className="mt-2 flex justify-center bg-gray-50 rounded-lg p-3">
                <img src={design.custom_logo} alt="Logo" className="max-h-[40px] object-contain" />
              </div>
            )}
            {!design.custom_logo && (
              <div className="mt-2 flex justify-center bg-gray-50 rounded-lg p-3">
                <img src="https://provoulevou.com.br/assets/provoulevou-logo.png" alt="Logo padrao" className="max-h-[40px] object-contain opacity-50" />
                <span className="text-[9px] text-brand-gray ml-2 self-center">(padrao)</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Accordion sections */}
      <div className="flex-1 overflow-y-auto">
        {SECTIONS.filter(s => !s.onlyFor || s.onlyFor === activeButton).map(({ id, label, icon, Component }) => (
          <div key={id} className="border-b border-gray-200">
            <button
              onClick={() => setOpenSection(openSection === id ? null : id)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm font-semibold text-brand-dark hover:bg-white transition"
            >
              <span>{icon}</span>
              <span>{label}</span>
              <span className="ml-auto text-brand-gray">{openSection === id ? '\u2212' : '+'}</span>
            </button>
            {openSection === id && (
              <div className="px-4 pb-4">
                <Component design={buttonDesign} onChange={handleChange} activeButton={activeButton} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
