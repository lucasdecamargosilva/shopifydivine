import React from 'react';

const CABINE_IMG_URL = 'https://i.ibb.co/50TPgYj/cabine-icone-oficial.png';

const ANIM_STYLES = {
  scale: { animation: 'mc-pulse-scale 2s ease-in-out infinite' },
  glow: { animation: 'mc-glow 2s ease-in-out infinite' },
  slide: { animation: 'mc-float 3s ease-in-out infinite' },
  shake: { animation: 'mc-shake 3s infinite' },
  none: {}
};

export default function PhotoButton({ design, isActive }) {
  const hasCustomImage = !!design.customButtonImage;

  if (hasCustomImage) {
    return (
      <div
        className={`absolute bottom-4 right-4 transition-all ${isActive ? 'ring-2 ring-dashed ring-brand-purple' : ''}`}
        style={{
          cursor: 'pointer',
          width: `${design.height || 60}px`,
          height: `${design.height || 60}px`,
          ...(ANIM_STYLES[design.hoverAnimation] || {}),
        }}
        title="Este botao abrira o Provador Virtual na sua loja"
      >
        <img
          src={design.customButtonImage}
          alt="Provador Virtual"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

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
    width: `${design.height || 60}px`,
    height: `${design.height || 60}px`,
    padding: '8px',
    boxShadow: design.shadow ? `0 4px 12px rgba(0,0,0,${design.shadowIntensity})` : 'none',
    transition: 'all 0.3s ease',
    ...(ANIM_STYLES[design.hoverAnimation] || {}),
  };

  return (
    <div
      className={`absolute bottom-4 right-4 transition-all ${isActive ? 'ring-2 ring-dashed ring-brand-purple' : ''}`}
      style={style}
      title="Este botao abrira o Provador Virtual na sua loja"
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
