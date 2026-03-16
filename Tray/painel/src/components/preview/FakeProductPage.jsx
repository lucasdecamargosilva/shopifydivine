import React, { useState } from 'react';
import PhotoButton from './PhotoButton';
import BuyButton from './BuyButton';

const PRODUCT_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', label: 'Vestido' },
  { url: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop', label: 'Camiseta' },
  { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', label: 'Calca' },
  { url: 'https://images.unsplash.com/photo-1570976447640-ac859083963f?w=400&h=500&fit=crop', label: 'Biquini' },
];

export default function FakeProductPage({ design, activeButton }) {
  const [imgIdx, setImgIdx] = useState(0);
  const showPhoto = design.button_mode === 'image' || design.button_mode === 'both';
  const showBuy = design.button_mode === 'buy' || design.button_mode === 'both';

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-sm mx-auto overflow-hidden">
      {/* Product image */}
      <div className="relative">
        <img
          src={PRODUCT_IMAGES[imgIdx].url}
          alt="Produto exemplo"
          className="w-full h-72 object-cover"
        />
        {showPhoto && (
          <PhotoButton design={design.photo_button} isActive={activeButton === 'photo_button'} />
        )}
      </div>

      {/* Product type selector */}
      <div className="flex justify-center gap-1 py-2 bg-gray-50 border-b border-gray-100">
        {PRODUCT_IMAGES.map((p, i) => (
          <button
            key={i}
            onClick={() => setImgIdx(i)}
            className={`px-2 py-0.5 text-[10px] rounded-full transition ${
              i === imgIdx ? 'bg-brand-purple text-white' : 'text-brand-gray hover:bg-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Product info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-900">Vestido Floral Estampado</h3>
        <div className="flex items-center gap-1 mt-1">
          {'\u2605\u2605\u2605\u2605\u2605'.split('').map((s, i) => <span key={i} className="text-yellow-400 text-xs">{s}</span>)}
          <span className="text-[10px] text-gray-400 ml-1">(23)</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-gray-400 line-through">R$ 299,90</span>
          <span className="text-sm font-bold text-gray-900">R$ 199,90</span>
        </div>

        {/* Colors */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-gray-500">Cor:</span>
          {['#000', '#3B82F6', '#EC4899'].map(c => (
            <div key={c} className="w-4 h-4 rounded-full border border-gray-300" style={{ background: c }} />
          ))}
        </div>

        {/* Sizes */}
        <div className="mt-2 flex gap-1">
          {['P', 'M', 'G', 'GG'].map(s => (
            <span key={s} className="px-2 py-0.5 text-[10px] border border-gray-300 rounded">{s}</span>
          ))}
        </div>

        {/* Buy button from Provador */}
        {showBuy && (
          <div className="mt-4">
            <BuyButton design={design.buy_button} isActive={activeButton === 'buy_button'} />
          </div>
        )}

        {/* Fake buy button */}
        <button className="w-full mt-3 py-3 bg-gray-900 text-white text-xs font-bold uppercase tracking-wider rounded">
          Comprar
        </button>
      </div>
    </div>
  );
}
