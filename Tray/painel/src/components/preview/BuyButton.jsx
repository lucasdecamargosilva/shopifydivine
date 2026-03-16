import React from 'react';

const CABINE_IMG_URL = 'https://i.ibb.co/50TPgYj/cabine-icone-oficial.png';

const ANIM_STYLES = {
  scale: { animation: 'mc-pulse-scale 2s ease-in-out infinite' },
  glow: { animation: 'mc-glow 2s ease-in-out infinite' },
  slide: { animation: 'mc-float 3s ease-in-out infinite' },
  shake: { animation: 'mc-shake 3s infinite' },
  none: {}
};

export default function BuyButton({ design, isActive }) {
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
    height: `${design.height}px`,
    fontFamily: design.fontFamily,
    fontSize: `${design.fontSize}px`,
    fontWeight: design.fontWeight,
    textTransform: design.textTransform,
    letterSpacing: `${design.letterSpacing}px`,
    boxShadow: design.shadow ? `0 4px 12px rgba(0,0,0,${design.shadowIntensity})` : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    cursor: 'pointer',
    width: '100%',
    flexDirection: design.iconPosition === 'right' ? 'row-reverse' : 'row',
    transition: 'all 0.3s ease',
    ...(ANIM_STYLES[design.hoverAnimation] || {}),
  };

  return (
    <div className="relative w-full" style={{ maxWidth: '200px', margin: '0 auto' }}>
      {/* Badge */}
      {design.badge && (
        <div
          className="absolute -top-7 -right-12 bg-black text-white px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wide whitespace-nowrap z-10 animate-bounce"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {design.badgeText || 'Novidade!'}
        </div>
      )}
      {/* SVG line */}
      {design.badge && (
        <svg className="absolute -top-5 -right-8 pointer-events-none z-0" width="80" height="40">
          <path d="M75,10 Q50,35 5,32" stroke="black" strokeWidth="1.2" fill="none" strokeDasharray="3,3" />
        </svg>
      )}
      <button
        className={`transition-all ${isActive ? 'ring-2 ring-dashed ring-brand-purple ring-offset-2' : ''}`}
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
        <span>{design.label}</span>
      </button>
    </div>
  );
}
