import React, { useState } from 'react';
import ColorControl from './controls/ColorControl';
import TextControl from './controls/TextControl';
import ShapeControl from './controls/ShapeControl';
import IconControl from './controls/IconControl';
import EffectsControl from './controls/EffectsControl';
import AdvancedControl from './controls/AdvancedControl';
import BuyButton from './preview/BuyButton';

const CABINE_IMG_URL = 'https://i.ibb.co/50TPgYj/cabine-icone-oficial.png';

function MiniPhotoButton({ design }) {
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
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '8px',
      boxShadow: design.shadow ? `0 4px 12px rgba(0,0,0,${design.shadowIntensity})` : 'none',
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
  { id: 'text', label: 'Texto', icon: '\u{270F}\u{FE0F}', Component: TextControl },
  { id: 'shape', label: 'Forma', icon: '\u{2B1C}', Component: ShapeControl },
  { id: 'icon', label: 'Icone', icon: '\u{2B50}', Component: IconControl },
  { id: 'effects', label: 'Efeitos', icon: '\u{2728}', Component: EffectsControl },
  { id: 'advanced', label: 'Avancado', icon: '\u{2699}\u{FE0F}', Component: AdvancedControl },
];

export default function EditorPanel({ design, activeButton, onChangeButton, onChangeMode, onChange }) {
  const [openSection, setOpenSection] = useState('colors');
  const buttonDesign = design[activeButton];

  function handleChange(field, value) {
    onChange(activeButton, { ...buttonDesign, [field]: value });
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

      {/* Button mode toggle */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <label className="text-xs font-semibold text-brand-dark uppercase tracking-wide">Onde exibir?</label>
        <div className="flex gap-2 mt-2">
          {[
            { value: 'image', label: 'Foto' },
            { value: 'buy', label: 'Compra' },
            { value: 'both', label: 'Ambos' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onChangeMode(opt.value)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
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

      {/* Accordion sections */}
      <div className="flex-1 overflow-y-auto">
        {SECTIONS.map(({ id, label, icon, Component }) => (
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
