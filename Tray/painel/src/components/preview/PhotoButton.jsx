import React, { useState } from 'react';

const CABINE_IMG_URL = 'https://i.ibb.co/50TPgYj/cabine-icone-oficial.png';

const HOVER_STYLES = {
  invert: { filter: 'invert(1)' },
  scale: { transform: 'scale(1.1)' },
  glow: { boxShadow: '0 0 15px rgba(123,47,242,0.5)' },
  slide: { transform: 'translateY(-2px)' },
  shake: { animation: 'mc-shake 0.5s ease-in-out' },
  none: {}
};

export default function PhotoButton({ design, isActive }) {
  const [hovered, setHovered] = useState(false);
  const showIcon = design.icon !== 'none';
  const isCustomIcon = design.icon === 'custom' && design.iconCustomUrl;

  const bgStyle = design.gradient
    ? { background: `linear-gradient(${design.gradient.direction}, ${design.gradient.colors[0]}, ${design.gradient.colors[1]})` }
    : { backgroundColor: design.backgroundColor };

  const style = {
    ...bgStyle,
    color: design.textColor,
    border: `${design.borderWidth}px solid ${design.borderColor}`,
    borderRadius: `${design.borderRadius}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    width: '60px',
    height: '60px',
    padding: '8px',
    transition: 'all 0.3s ease',
    ...(hovered ? HOVER_STYLES[design.hoverAnimation] || {} : {}),
  };

  return (
    <div
      className={`absolute bottom-4 right-4 transition-all ${isActive ? 'ring-2 ring-dashed ring-brand-purple' : ''}`}
      style={style}
      title="Este botao abrira o Provador Virtual na sua loja"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
