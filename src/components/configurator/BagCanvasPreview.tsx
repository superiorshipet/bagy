'use client';

import React from 'react';
import { CustomBagConfiguration } from '@/types/bag';
import { BAG_TYPES, MATERIALS, COLORS, HARDWARE_OPTIONS, SIZES } from '@/data/bagOptions';

interface BagCanvasPreviewProps {
  config: CustomBagConfiguration;
  className?: string;
  viewAngle?: 'front' | 'side' | 'strap';
}

export const BagCanvasPreview: React.FC<BagCanvasPreviewProps> = ({
  config,
  className = '',
  viewAngle = 'front',
}) => {
  const currentType = BAG_TYPES.find((t) => t.id === config.bagType) || BAG_TYPES[0];
  const currentMaterial = MATERIALS.find((m) => m.id === config.materialId) || MATERIALS[0];
  const currentColor = COLORS.find((c) => c.id === config.primaryColorId) || COLORS[0];
  const currentHardware = HARDWARE_OPTIONS.find((h) => h.id === config.hardware) || HARDWARE_OPTIONS[0];
  const currentSize = SIZES.find((s) => s.id === config.size) || SIZES[1];

  const primaryHex = currentColor.hex;
  const hardwareColor = currentHardware.color;

  // Determine scale based on size
  const scaleMap = {
    mini: 0.82,
    small: 0.9,
    medium: 1.0,
    large: 1.12,
  };
  const sizeScale = scaleMap[config.size] || 1;

  return (
    <div className={`relative w-full aspect-[4/3] flex items-center justify-center p-2.5 sm:p-5 bg-gradient-to-b from-[#f9f7f4] to-[#f0ece5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner ${className}`}>
      {/* Background Studio Lighting & Pedestal Shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.85)_0%,rgba(240,235,225,0.3)_60%,transparent_100%)] pointer-events-none" />
      <div className="absolute bottom-4 w-4/5 h-8 bg-black/10 rounded-[100%] blur-xl pointer-events-none" />

      {/* Dynamic Bag SVG */}
      <svg
        viewBox="0 0 400 360"
        className="w-full h-full max-h-[360px] drop-shadow-2xl transition-all duration-500 ease-out z-10"
        style={{ transform: `scale(${sizeScale})` }}
      >
        <defs>
          {/* Leather Gradient lighting */}
          <linearGradient id="leatherLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
          </linearGradient>

          {/* Saffiano crosshatch texture pattern */}
          <pattern id="saffianoPattern" width="6" height="6" patternUnits="userSpaceOnUse">
            <path d="M0 6 L6 0 M0 0 L6 6" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
            <path d="M0 3 L3 0 M3 6 L6 3" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />
          </pattern>

          {/* Croc texture pattern */}
          <pattern id="crocPattern" width="20" height="16" patternUnits="userSpaceOnUse">
            <rect x="1" y="1" width="18" height="14" rx="3" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
            <rect x="2" y="2" width="16" height="12" rx="2" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          </pattern>

          {/* Metallic Gold / Silver / Hardware Gradient */}
          <linearGradient id="hardwareGradient" x1="0%" y1="0%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={hardwareColor} stopOpacity="1" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.75" />
            <stop offset="70%" stopColor={hardwareColor} stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.4" />
          </linearGradient>

          {/* Monogram Foil Gradient */}
          <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe599" />
            <stop offset="50%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>
          <linearGradient id="silverFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#c0c0c0" />
            <stop offset="100%" stopColor="#7a7a7a" />
          </linearGradient>
        </defs>

        {/* 1. BAG HANDLES / STRAP (Behind Body) */}
        {config.bagType === 'tote' && (
          <g className="transition-all duration-300">
            {/* Handle arches */}
            <path
              d="M 140 160 C 140 60, 260 60, 260 160"
              fill="none"
              stroke={primaryHex}
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 140 160 C 140 60, 260 60, 260 160"
              fill="none"
              stroke="url(#leatherLight)"
              strokeWidth="16"
              strokeLinecap="round"
            />
          </g>
        )}

        {config.bagType === 'shoulder' && (
          <g>
            <path
              d="M 130 180 C 130 80, 270 80, 270 180"
              fill="none"
              stroke={primaryHex}
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M 130 180 C 130 80, 270 80, 270 180"
              fill="none"
              stroke="url(#leatherLight)"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </g>
        )}

        {(config.bagType === 'crossbody' || config.bagType === 'mini') && (
          <g>
            {config.strapId === 'chunky_chain' ? (
              <path
                d="M 115 190 C 115 50, 285 50, 285 190"
                fill="none"
                stroke="url(#hardwareGradient)"
                strokeWidth="8"
                strokeDasharray="4 8"
                strokeLinecap="round"
              />
            ) : config.strapId === 'woven_guitar' ? (
              <path
                d="M 115 190 C 115 50, 285 50, 285 190"
                fill="none"
                stroke="#d4af37"
                strokeWidth="18"
                strokeDasharray="6 3"
              />
            ) : (
              <path
                d="M 115 190 C 115 50, 285 50, 285 190"
                fill="none"
                stroke={primaryHex}
                strokeWidth="10"
                strokeLinecap="round"
              />
            )}
          </g>
        )}

        {config.bagType === 'backpack' && (
          <g>
            <path
              d="M 170 140 C 170 100, 230 100, 230 140"
              fill="none"
              stroke={primaryHex}
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 170 140 C 170 100, 230 100, 230 140"
              fill="none"
              stroke="url(#leatherLight)"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* 2. BAG MAIN BODY SILHOUETTES */}
        {config.bagType === 'tote' && (
          <g id="tote-body">
            {/* Trapezoid Tote Body */}
            <path
              d="M 110 150 L 290 150 L 275 310 Q 270 325 250 325 L 150 325 Q 130 325 125 310 Z"
              fill={primaryHex}
              className="transition-colors duration-300"
            />
            {/* Texture overlay */}
            {currentMaterial.texture === 'crosshatch' && (
              <path
                d="M 110 150 L 290 150 L 275 310 Q 270 325 250 325 L 150 325 Q 130 325 125 310 Z"
                fill="url(#saffianoPattern)"
              />
            )}
            {currentMaterial.texture === 'croc' && (
              <path
                d="M 110 150 L 290 150 L 275 310 Q 270 325 250 325 L 150 325 Q 130 325 125 310 Z"
                fill="url(#crocPattern)"
              />
            )}
            {/* Realistic Light and shadow */}
            <path
              d="M 110 150 L 290 150 L 275 310 Q 270 325 250 325 L 150 325 Q 130 325 125 310 Z"
              fill="url(#leatherLight)"
            />
            {/* Top Rim stitched fold */}
            <path d="M 110 150 L 290 150" stroke="rgba(0,0,0,0.25)" strokeWidth="4" />
            <path d="M 112 155 L 288 155" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Handle Base Hardware Clasps */}
            <rect x="135" y="152" width="10" height="16" rx="2" fill="url(#hardwareGradient)" />
            <rect x="255" y="152" width="10" height="16" rx="2" fill="url(#hardwareGradient)" />
          </g>
        )}

        {(config.bagType === 'crossbody' || config.bagType === 'mini') && (
          <g id="crossbody-body">
            {/* Curved Flap Bag */}
            <path
              d="M 115 170 Q 115 155 130 155 L 270 155 Q 285 155 285 170 L 285 285 Q 285 310 260 310 L 140 310 Q 115 310 115 285 Z"
              fill={primaryHex}
              className="transition-colors duration-300"
            />
            {currentMaterial.texture === 'crosshatch' && (
              <path
                d="M 115 170 Q 115 155 130 155 L 270 155 Q 285 155 285 170 L 285 285 Q 285 310 260 310 L 140 310 Q 115 310 115 285 Z"
                fill="url(#saffianoPattern)"
              />
            )}
            {currentMaterial.texture === 'croc' && (
              <path
                d="M 115 170 Q 115 155 130 155 L 270 155 Q 285 155 285 170 L 285 285 Q 285 310 260 310 L 140 310 Q 115 310 115 285 Z"
                fill="url(#crocPattern)"
              />
            )}
            <path
              d="M 115 170 Q 115 155 130 155 L 270 155 Q 285 155 285 170 L 285 285 Q 285 310 260 310 L 140 310 Q 115 310 115 285 Z"
              fill="url(#leatherLight)"
            />

            {/* Front Envelope Flap */}
            <path
              d="M 115 160 L 285 160 L 285 220 Q 200 265 115 220 Z"
              fill={primaryHex}
              filter="drop-shadow(0px 5px 6px rgba(0,0,0,0.25))"
            />
            <path
              d="M 115 160 L 285 160 L 285 220 Q 200 265 115 220 Z"
              fill="url(#leatherLight)"
            />
            {/* Flap edge decorative stitching */}
            <path
              d="M 118 162 L 282 162 L 282 216 Q 200 260 118 216 Z"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Iconic Metallic Turnlock Clasp */}
            <ellipse cx="200" cy="242" rx="14" ry="11" fill="url(#hardwareGradient)" stroke="#1a1a1a" strokeWidth="0.5" />
            <rect x="194" y="238" width="12" height="8" rx="2" fill="#111111" />
            <circle cx="200" cy="242" r="3" fill="url(#hardwareGradient)" />
          </g>
        )}

        {config.bagType === 'shoulder' && (
          <g id="shoulder-body">
            {/* Baguette curved silhouette */}
            <path
              d="M 110 190 Q 110 170 135 170 L 265 170 Q 290 170 290 190 L 290 280 Q 290 305 265 305 L 135 305 Q 110 305 110 280 Z"
              fill={primaryHex}
            />
            {currentMaterial.texture === 'crosshatch' && (
              <path
                d="M 110 190 Q 110 170 135 170 L 265 170 Q 290 170 290 190 L 290 280 Q 290 305 265 305 L 135 305 Q 110 305 110 280 Z"
                fill="url(#saffianoPattern)"
              />
            )}
            {currentMaterial.texture === 'croc' && (
              <path
                d="M 110 190 Q 110 170 135 170 L 265 170 Q 290 170 290 190 L 290 280 Q 290 305 265 305 L 135 305 Q 110 305 110 280 Z"
                fill="url(#crocPattern)"
              />
            )}
            <path
              d="M 110 190 Q 110 170 135 170 L 265 170 Q 290 170 290 190 L 290 280 Q 290 305 265 305 L 135 305 Q 110 305 110 280 Z"
              fill="url(#leatherLight)"
            />

            {/* Zipper top trim */}
            <rect x="130" y="167" width="140" height="6" rx="2" fill="url(#hardwareGradient)" />
            {/* Center Buckle */}
            <circle cx="200" cy="225" r="12" fill="url(#hardwareGradient)" />
          </g>
        )}

        {config.bagType === 'backpack' && (
          <g id="backpack-body">
            {/* Dome-shaped Backpack */}
            <path
              d="M 130 315 L 270 315 Q 285 315 285 295 L 280 200 Q 275 140 200 140 Q 125 140 120 200 L 115 295 Q 115 315 130 315 Z"
              fill={primaryHex}
            />
            <path
              d="M 130 315 L 270 315 Q 285 315 285 295 L 280 200 Q 275 140 200 140 Q 125 140 120 200 L 115 295 Q 115 315 130 315 Z"
              fill="url(#leatherLight)"
            />
            {/* Front Zipper Pocket */}
            <path
              d="M 140 240 L 260 240 Q 270 240 270 255 L 268 300 Q 268 310 255 310 L 145 310 Q 132 310 132 300 L 130 255 Q 130 240 140 240 Z"
              fill={primaryHex}
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))"
            />
            <path
              d="M 140 240 L 260 240 Q 270 240 270 255 L 268 300 Q 268 310 255 310 L 145 310 Q 132 310 132 300 L 130 255 Q 130 240 140 240 Z"
              fill="url(#leatherLight)"
            />
            {/* Pocket Zipper with hardware puller */}
            <line x1="145" y1="245" x2="255" y2="245" stroke="url(#hardwareGradient)" strokeWidth="3" />
            <circle cx="200" cy="245" r="5" fill="url(#hardwareGradient)" />
          </g>
        )}

        {config.bagType === 'clutch' && (
          <g id="clutch-body">
            {/* Rectangular envelope clutch */}
            <rect x="100" y="170" width="200" height="130" rx="8" fill={primaryHex} />
            <rect x="100" y="170" width="200" height="130" rx="8" fill="url(#leatherLight)" />
            {/* Triangular V flap */}
            <path
              d="M 100 170 L 300 170 L 200 245 Z"
              fill={primaryHex}
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))"
            />
            <path d="M 100 170 L 300 170 L 200 245 Z" fill="url(#leatherLight)" />
            {/* Clasp Point */}
            <circle cx="200" cy="245" r="8" fill="url(#hardwareGradient)" />
          </g>
        )}

        {/* 3. PERSONALIZED MONOGRAM RENDERING (EMBOSSED / FOIL / TEXT) */}
        {config.monogram.enabled && config.monogram.text.trim().length > 0 && (
          <g id="monogram-text">
            {/* Subtle shadow for emboss depth */}
            <text
              x="200"
              y={config.bagType === 'tote' ? 246 : config.bagType === 'crossbody' || config.bagType === 'mini' ? 278 : 265}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={
                config.monogram.font === 'serif'
                  ? 'Playfair Display, Georgia, serif'
                  : config.monogram.font === 'script'
                  ? 'Brush Script MT, cursive'
                  : 'Inter, Arial, sans-serif'
              }
              fontWeight="bold"
              letterSpacing="3px"
              fontSize="16"
              fill="rgba(0,0,0,0.4)"
              dy="1"
            >
              {config.monogram.text.toUpperCase()}
            </text>

            {/* Primary Foil/Emboss */}
            <text
              x="200"
              y={config.bagType === 'tote' ? 245 : config.bagType === 'crossbody' || config.bagType === 'mini' ? 277 : 264}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily={
                config.monogram.font === 'serif'
                  ? 'Playfair Display, Georgia, serif'
                  : config.monogram.font === 'script'
                  ? 'Brush Script MT, cursive'
                  : 'Inter, Arial, sans-serif'
              }
              fontWeight="bold"
              letterSpacing="3px"
              fontSize="16"
              fill={
                config.monogram.style === 'gold_foil'
                  ? 'url(#goldFoil)'
                  : config.monogram.style === 'silver_foil'
                  ? 'url(#silverFoil)'
                  : 'rgba(255,255,255,0.7)'
              }
              filter={config.monogram.style !== 'blind_emboss' ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' : undefined}
            >
              {config.monogram.text.toUpperCase()}
            </text>
          </g>
        )}

        {/* 4. LEATHER LUGGAGE TAG / CHARM (IF SELECTED) */}
        {config.selectedAddonIds.includes('bag_charm') && (
          <g id="addon-bag-charm" transform="translate(130, 160)">
            {/* Cord */}
            <line x1="10" y1="0" x2="18" y2="35" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
            {/* Tag */}
            <rect
              x="8"
              y="32"
              width="20"
              height="36"
              rx="4"
              fill={primaryHex}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.8"
              filter="drop-shadow(2px 3px 4px rgba(0,0,0,0.3))"
            />
            {/* Gold foil on charm */}
            <circle cx="18" cy="50" r="4" fill="url(#goldFoil)" />
          </g>
        )}
      </svg>

      {/* Floating Info Badges */}
      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-stone-800 shadow-sm border border-stone-200/50 flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full inline-block border border-black/10" style={{ backgroundColor: primaryHex }} />
        <span>{currentColor.nameAr}</span>
      </div>

      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-stone-800 shadow-sm border border-stone-200/50 flex items-center gap-1">
        <span>{currentSize.nameAr}</span>
        <span className="text-stone-400">|</span>
        <span className="text-amber-700">{currentHardware.nameAr}</span>
      </div>
    </div>
  );
};
