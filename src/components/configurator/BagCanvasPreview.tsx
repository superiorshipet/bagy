'use client';

import React from 'react';
import { CustomBagConfiguration } from '@/types/bag';
import { BAG_TYPES, MATERIALS, COLORS, HARDWARE_OPTIONS, SIZES, STRAPS } from '@/data/bagOptions';

interface BagCanvasPreviewProps {
  config: CustomBagConfiguration;
  className?: string;
  viewAngle?: 'front' | 'side' | 'strap';
  imageUrl?: string;
}

export const BagCanvasPreview: React.FC<BagCanvasPreviewProps> = ({
  config,
  className = '',
  viewAngle = 'front',
  imageUrl,
}) => {
  const currentType = BAG_TYPES.find((t) => t.id === config.bagType) || BAG_TYPES[0];
  const currentMaterial = MATERIALS.find((m) => m.id === config.materialId) || MATERIALS[0];
  const currentColor = COLORS.find((c) => c.id === config.primaryColorId) || COLORS[0];
  const currentHardware = HARDWARE_OPTIONS.find((h) => h.id === config.hardware) || HARDWARE_OPTIONS[0];
  const currentSize = SIZES.find((s) => s.id === config.size) || SIZES[1];
  const currentStrap = STRAPS.find((s) => s.id === config.strapId) || STRAPS[0];

  const primaryHex = config.customColorHex || (config.primaryColorId?.startsWith('#') ? config.primaryColorId : currentColor.hex);
  const colorDisplayName = config.customColorName || (config.customColorHex ? `مخصص (${config.customColorHex})` : currentColor.nameAr);
  const hardwareColor = currentHardware.color;

  // View mode: 3D interactive SVG is always the primary default
  const [viewMode, setViewMode] = React.useState<'3d' | 'photo'>('3d');

  // Support all 6 built-in types + Balmain pleated bag (for 'vv' / 'balmain') + fallback designer crescent/hobo
  const isBuiltIn = ['tote', 'shoulder', 'crossbody', 'mini', 'backpack', 'clutch'].includes(config.bagType);
  const isBalmain = config.bagType === 'vv' || config.bagType === 'balmain' || config.bagType?.toLowerCase().includes('balmain');
  const isCustomOrHobo = (!isBuiltIn && !isBalmain) || config.bagType === 'crescent' || config.bagType === 'hobo' || config.bagType === 'ava' || config.bagType === 'u';

  // Determine scale based on size
  const scaleMap = {
    mini: 0.82,
    small: 0.9,
    medium: 1.0,
    large: 1.12,
  };
  const sizeScale = scaleMap[config.size] || 1;

  // Monogram positioning & typography calculation
  const monogramY =
    config.bagType === 'clutch'
      ? 236
      : config.bagType === 'tote'
      ? 242
      : config.bagType === 'crossbody' || config.bagType === 'mini'
      ? 278
      : config.bagType === 'shoulder'
      ? 252
      : isBalmain
      ? 262
      : isCustomOrHobo
      ? 270
      : 275;

  const textLength = config.monogram.text.trim().length;
  const monogramFontSize = textLength <= 2 ? 14 : textLength <= 4 ? 12 : 10.5;
  const letterSpacing = config.monogram.font === 'script' ? '2px' : '4px';
  const fontFamily =
    config.monogram.font === 'serif'
      ? 'var(--font-playfair), "Playfair Display", Georgia, "Times New Roman", serif'
      : config.monogram.font === 'script'
      ? '"Brush Script MT", "Caveat", "Dancing Script", cursive'
      : 'var(--font-inter), Inter, system-ui, sans-serif';

  return (
    <div className={`relative w-full aspect-[4/3] flex items-center justify-center p-2.5 sm:p-5 bg-gradient-to-b from-[#f9f7f4] to-[#f0ece5] dark:from-[#1b1b26] dark:to-[#12121c] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner ${className}`}>
      {/* Background Studio Lighting & Pedestal Shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.85)_0%,rgba(240,235,225,0.3)_60%,transparent_100%)] pointer-events-none" />
      <div className="absolute bottom-4 w-4/5 h-8 bg-black/10 rounded-[100%] blur-xl pointer-events-none" />

      {/* Floating View Switcher (Allows switching between 3D Interactive Model and Real Photo) */}
      {imageUrl && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-white/95 dark:bg-[#1a1a26]/95 backdrop-blur-md p-1 rounded-full shadow-lg border border-stone-200/80 dark:border-stone-700">
          <button
            type="button"
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === '3d'
                ? 'bg-[#9b287b] text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>✨ مجسم 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('photo')}
            className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1 ${
              viewMode === 'photo'
                ? 'bg-[#9b287b] text-white shadow-sm'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <span>📷 صورة الموديل</span>
          </button>
        </div>
      )}

      {/* Dynamic Bag Image Canvas (Photo Mode) vs Vector 3D SVG (3D Mode - DEFAULT) */}
      {imageUrl && viewMode === 'photo' ? (
        <div
          className="relative w-full h-full max-h-[360px] flex items-center justify-center z-10 p-2 sm:p-4 transition-transform duration-500 ease-out"
          style={{ transform: `scale(${sizeScale})` }}
        >
          <div className="relative max-w-full max-h-[310px] flex items-center justify-center">
            {/* 1. Base Bag Photo (The user's exact uploaded/linked bag) */}
            <img
              src={imageUrl}
              alt={colorDisplayName}
              className="max-h-[300px] w-auto max-w-full object-contain drop-shadow-2xl rounded-2xl transition-all duration-300 select-none"
            />

            {/* 2. Real-Time Dynamic Leather Color Tint Overlay */}
            {/* Shifts the image's leather color smoothly while preserving natural shadows & highlights */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
              style={{
                backgroundColor: primaryHex,
                mixBlendMode: 'color',
                opacity: 0.65,
              }}
            />
            {/* Shadow & Depth Multiplier for realistic leather shading */}
            <div
              className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500"
              style={{
                backgroundColor: primaryHex,
                mixBlendMode: 'multiply',
                opacity: config.primaryColorId === 'onyx_black' ? 0.35 : 0.14,
              }}
            />

            {/* 3. Texture overlay if Saffiano or Croc selected */}
            {currentMaterial.texture === 'crosshatch' && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'radial-gradient(rgba(0,0,0,0.5) 1px, transparent 0)',
                  backgroundSize: '4px 4px',
                  mixBlendMode: 'overlay',
                }}
              />
            )}
            {currentMaterial.texture === 'croc' && (
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-25"
                style={{
                  backgroundImage: 'radial-gradient(rgba(0,0,0,0.7) 2px, transparent 0)',
                  backgroundSize: '18px 14px',
                  mixBlendMode: 'overlay',
                }}
              />
            )}

            {/* 4. Luxury Monogram Hot Stamping directly on the bag image */}
            {config.monogram.enabled && textLength > 0 && (
              <div className="absolute inset-x-0 bottom-12 sm:bottom-14 flex justify-center pointer-events-none">
                <div
                  className={`px-3.5 py-1.5 rounded-lg border backdrop-blur-md shadow-2xl transition-all duration-300 flex items-center gap-1.5 ${
                    config.monogram.style === 'gold_foil'
                      ? 'bg-black/75 border-[#d4af37] text-[#ffe082] shadow-[0_0_15px_rgba(212,175,55,0.45)]'
                      : config.monogram.style === 'silver_foil'
                      ? 'bg-black/75 border-slate-300 text-slate-100 shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                      : 'bg-black/60 border-black/40 text-stone-200'
                  }`}
                >
                  <span
                    style={{
                      fontFamily: fontFamily,
                      letterSpacing: letterSpacing,
                      fontSize: `${monogramFontSize + 1}px`,
                    }}
                    className="font-black uppercase drop-shadow-md"
                  >
                    {config.monogram.text.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
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

          {/* Luxury Metallic Foil Gradients for Monogram Hot Stamping */}
          <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#fff8db" />
            <stop offset="25%" stopColor="#eec75f" />
            <stop offset="50%" stopColor="#fff0b3" />
            <stop offset="75%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#8c6218" />
          </linearGradient>
          <linearGradient id="silverFoil" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#d1d5db" />
            <stop offset="60%" stopColor="#ffffff" />
            <stop offset="85%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#4b5563" />
          </linearGradient>

          {/* Bohemian Jacquard Woven Pattern */}
          <pattern id="bohoJacquardPattern" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <rect width="28" height="28" fill="#181824" />
            {/* Geometric diamond / chevron tapestry */}
            <path d="M 0 14 L 14 0 L 28 14 L 14 28 Z" fill="#d97706" />
            <path d="M 7 14 L 14 7 L 21 14 L 14 21 Z" fill="#ec4899" />
            <circle cx="14" cy="14" r="3" fill="#06b6d4" />
            <line x1="0" y1="0" x2="28" y2="0" stroke="#f59e0b" strokeWidth="2" />
            <line x1="0" y1="28" x2="28" y2="28" stroke="#f59e0b" strokeWidth="2" />
          </pattern>
        </defs>

        {/* 1. BAG HANDLES / STRAP (Behind Body) */}
        {config.bagType === 'tote' && (
          <g className="transition-all duration-300">
            {config.strapId === 'chunky_chain' ? (
              <g>
                <path
                  d="M 140 160 C 140 60, 260 60, 260 160"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <path
                  d="M 140 160 C 140 60, 260 60, 260 160"
                  fill="none"
                  stroke="url(#hardwareGradient)"
                  strokeWidth="11"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                />
              </g>
            ) : config.strapId === 'woven_guitar' ? (
              <g>
                <path
                  d="M 140 160 C 140 60, 260 60, 260 160"
                  fill="none"
                  stroke="#181824"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <path
                  d="M 140 160 C 140 60, 260 60, 260 160"
                  fill="none"
                  stroke="url(#bohoJacquardPattern)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g>
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
          </g>
        )}

        {config.bagType === 'shoulder' && (
          <g className="transition-all duration-300">
            {config.strapId === 'chunky_chain' ? (
              <g>
                <path
                  d="M 130 180 C 130 70, 270 70, 270 180"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 130 180 C 130 70, 270 70, 270 180"
                  fill="none"
                  stroke="url(#hardwareGradient)"
                  strokeWidth="10"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                />
                <path
                  d="M 130 180 C 130 70, 270 70, 270 180"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="2 12"
                  strokeOpacity="0.8"
                />
              </g>
            ) : config.strapId === 'woven_guitar' ? (
              <g>
                <path
                  d="M 130 180 C 130 70, 270 70, 270 180"
                  fill="none"
                  stroke="#181824"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                <path
                  d="M 130 180 C 130 70, 270 70, 270 180"
                  fill="none"
                  stroke="url(#bohoJacquardPattern)"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
              </g>
            ) : (
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
          </g>
        )}

        {(config.bagType === 'crossbody' || config.bagType === 'mini') && (
          <g className="transition-all duration-300">
            {config.strapId === 'chunky_chain' ? (
              <g>
                <path
                  d="M 115 190 C 115 50, 285 50, 285 190"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 115 190 C 115 50, 285 50, 285 190"
                  fill="none"
                  stroke="url(#hardwareGradient)"
                  strokeWidth="8"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                />
                <path
                  d="M 115 190 C 115 50, 285 50, 285 190"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="2 12"
                  strokeOpacity="0.8"
                />
              </g>
            ) : config.strapId === 'woven_guitar' ? (
              <g>
                <path
                  d="M 115 190 C 115 50, 285 50, 285 190"
                  fill="none"
                  stroke="#181824"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                <path
                  d="M 115 190 C 115 50, 285 50, 285 190"
                  fill="none"
                  stroke="url(#bohoJacquardPattern)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                {/* Leather connector tabs */}
                <rect x="108" y="172" width="14" height="20" rx="3" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
                <rect x="278" y="172" width="14" height="20" rx="3" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
              </g>
            ) : (
              <g>
                <path
                  d="M 115 190 C 115 50, 285 50, 285 190"
                  fill="none"
                  stroke={primaryHex}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 115 190 C 115 50, 285 50, 285 190"
                  fill="none"
                  stroke="url(#leatherLight)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </g>
            )}
          </g>
        )}

        {config.bagType === 'clutch' && (
          <g id="clutch-strap" className="transition-all duration-300">
            {config.strapId === 'woven_guitar' ? (
              <g>
                {/* Wide bohemian jacquard guitar strap */}
                <path
                  d="M 105 120 C 105 30, 295 30, 295 120"
                  fill="none"
                  stroke="#181824"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                <path
                  d="M 105 120 C 105 30, 295 30, 295 120"
                  fill="none"
                  stroke="url(#bohoJacquardPattern)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                {/* Leather ends connecting to clutch */}
                <rect x="98" y="102" width="14" height="20" rx="3" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                <rect x="288" y="102" width="14" height="20" rx="3" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
                {/* Hardware rings and clips */}
                <circle cx="105" cy="118" r="5" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.5" />
                <circle cx="295" cy="118" r="5" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.5" />
              </g>
            ) : config.strapId === 'chunky_chain' ? (
              <g>
                {/* Luxury chunky chain strap arching over clutch */}
                <path
                  d="M 105 120 C 105 25, 295 25, 295 120"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="11"
                  strokeLinecap="round"
                />
                <path
                  d="M 105 120 C 105 25, 295 25, 295 120"
                  fill="none"
                  stroke="url(#hardwareGradient)"
                  strokeWidth="9"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                />
                <path
                  d="M 105 120 C 105 25, 295 25, 295 120"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="2 12"
                  strokeOpacity="0.8"
                />
                {/* Chain attachment loops */}
                <circle cx="105" cy="116" r="6" fill="url(#hardwareGradient)" />
                <circle cx="295" cy="116" r="6" fill="url(#hardwareGradient)" />
              </g>
            ) : (
              <g>
                {/* Classic matching leather wristlet loop */}
                <path
                  d="M 90 135 C 45 135, 40 190, 75 220 C 88 232, 92 215, 90 165"
                  fill="none"
                  stroke={primaryHex}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M 90 135 C 45 135, 40 190, 75 220 C 88 232, 92 215, 90 165"
                  fill="none"
                  stroke="url(#leatherLight)"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <circle cx="90" cy="140" r="5" fill="url(#hardwareGradient)" />
              </g>
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

        {isBalmain && (
          <g id="balmain-handle-and-interior" className="transition-all duration-300">
            {/* 1. Interior shaded cavity visible in the top scoop */}
            <path
              d="M 125 158 Q 200 198 275 158 Q 200 135 125 158 Z"
              fill="#101016"
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))"
            />
            {/* Interior leather rim highlight */}
            <path
              d="M 125 158 Q 200 198 275 158"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
            />

            {/* 2. Main Curved Shoulder Handle Arch */}
            {config.strapId === 'woven_guitar' ? (
              <g>
                <path
                  d="M 122 170 C 110 50, 290 50, 278 170"
                  fill="none"
                  stroke="#181824"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M 122 170 C 110 50, 290 50, 278 170"
                  fill="none"
                  stroke="url(#bohoJacquardPattern)"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
              </g>
            ) : config.strapId === 'chunky_chain' ? (
              <g>
                <path
                  d="M 122 170 C 110 50, 290 50, 278 170"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 122 170 C 110 50, 290 50, 278 170"
                  fill="none"
                  stroke="url(#hardwareGradient)"
                  strokeWidth="11"
                  strokeDasharray="6 9"
                  strokeLinecap="round"
                />
                <path
                  d="M 122 170 C 110 50, 290 50, 278 170"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="2 13"
                  strokeOpacity="0.85"
                />
              </g>
            ) : (
              <g>
                {/* Sculptural Leather Handle with subtle taper and 3D lighting */}
                <path
                  d="M 122 170 C 110 50, 290 50, 278 170"
                  fill="none"
                  stroke={primaryHex}
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                <path
                  d="M 122 170 C 110 50, 290 50, 278 170"
                  fill="none"
                  stroke="url(#leatherLight)"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                {/* Edge fine stitching along the handle */}
                <path
                  d="M 124 165 C 114 55, 286 55, 276 165"
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Left side adjustment strap tab & metal buckle as seen in Balmain bag photo */}
                <g id="balmain-handle-buckle">
                  <rect
                    x="114"
                    y="108"
                    width="12"
                    height="18"
                    rx="3"
                    fill="url(#hardwareGradient)"
                    stroke="#111"
                    strokeWidth="0.5"
                    filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
                  />
                  <line x1="114" y1="117" x2="126" y2="117" stroke="#111" strokeWidth="2" />
                  <path
                    d="M 118 126 L 114 158 Q 112 165 108 165 Q 104 165 106 156 L 112 126 Z"
                    fill={primaryHex}
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M 118 126 L 114 158 Q 112 165 108 165 Q 104 165 106 156 L 112 126 Z"
                    fill="url(#leatherLight)"
                  />
                </g>
              </g>
            )}
          </g>
        )}

        {isCustomOrHobo && (
          <g id="crescent-strap" className="transition-all duration-300">
            {config.strapId === 'woven_guitar' ? (
              <g>
                <path
                  d="M 116 172 C 112 45, 288 45, 284 172"
                  fill="none"
                  stroke="#181824"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                <path
                  d="M 116 172 C 112 45, 288 45, 284 172"
                  fill="none"
                  stroke="url(#bohoJacquardPattern)"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <rect x="109" y="156" width="14" height="20" rx="3" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
                <rect x="277" y="156" width="14" height="20" rx="3" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
              </g>
            ) : config.strapId === 'chunky_chain' ? (
              <g>
                <path
                  d="M 116 172 C 112 45, 288 45, 284 172"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M 116 172 C 112 45, 288 45, 284 172"
                  fill="none"
                  stroke="url(#hardwareGradient)"
                  strokeWidth="10"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                />
                <path
                  d="M 116 172 C 112 45, 288 45, 284 172"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="2 12"
                  strokeOpacity="0.8"
                />
              </g>
            ) : (
              <g>
                {/* Classic Celine curved shoulder leather strap */}
                <path
                  d="M 116 172 C 112 50, 288 50, 284 172"
                  fill="none"
                  stroke={primaryHex}
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  d="M 116 172 C 112 50, 288 50, 284 172"
                  fill="none"
                  stroke="url(#leatherLight)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                {/* Gold adjustment pin buckle */}
                <rect x="123" y="102" width="10" height="15" rx="2" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.5" />
                <line x1="123" y1="110" x2="133" y2="110" stroke="#111" strokeWidth="1.5" />
              </g>
            )}
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
            {/* Rectangular envelope clutch centered nicely */}
            <rect x="85" y="115" width="230" height="150" rx="12" fill={primaryHex} />
            {currentMaterial.texture === 'crosshatch' && (
              <rect x="85" y="115" width="230" height="150" rx="12" fill="url(#saffianoPattern)" />
            )}
            {currentMaterial.texture === 'croc' && (
              <rect x="85" y="115" width="230" height="150" rx="12" fill="url(#crocPattern)" />
            )}
            <rect x="85" y="115" width="230" height="150" rx="12" fill="url(#leatherLight)" />

            {/* Triangular V flap */}
            <path
              d="M 85 115 L 315 115 L 200 205 Z"
              fill={primaryHex}
              filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))"
            />
            {currentMaterial.texture === 'croc' && (
              <path d="M 85 115 L 315 115 L 200 205 Z" fill="url(#crocPattern)" />
            )}
            <path d="M 85 115 L 315 115 L 200 205 Z" fill="url(#leatherLight)" />

            {/* Edge stitching */}
            <path
              d="M 89 117 L 311 117 L 200 201 Z"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Clasp Point */}
            <circle cx="200" cy="205" r="9" fill="url(#hardwareGradient)" stroke="#1a1a1a" strokeWidth="0.5" />
            <circle cx="200" cy="205" r="4" fill="#111111" />
          </g>
        )}

        {isBalmain && (
          <g id="balmain-body" className="transition-all duration-300">
            {/* A. Base Silhouette & Volume (Upper draped tier + Lower billowing cloud pouch) */}
            <path
              d="M 120 162
                 Q 200 196 280 162
                 C 288 185, 280 205, 270 216
                 C 325 245, 335 285, 310 312
                 C 290 328, 245 322, 200 322
                 C 155 322, 110 328, 90 312
                 C 65 285, 75 245, 130 216
                 C 120 205, 112 185, 120 162 Z"
              fill={primaryHex}
              className="transition-colors duration-300"
              filter="drop-shadow(0 12px 18px rgba(0,0,0,0.35))"
            />

            {/* Leather texture overlay if selected */}
            {currentMaterial.texture === 'crosshatch' && (
              <path
                d="M 120 162
                   Q 200 196 280 162
                   C 288 185, 280 205, 270 216
                   C 325 245, 335 285, 310 312
                   C 290 328, 245 322, 200 322
                   C 155 322, 110 328, 90 312
                   C 65 285, 75 245, 130 216
                   C 120 205, 112 185, 120 162 Z"
                fill="url(#saffianoPattern)"
              />
            )}
            {currentMaterial.texture === 'croc' && (
              <path
                d="M 120 162
                   Q 200 196 280 162
                   C 288 185, 280 205, 270 216
                   C 325 245, 335 285, 310 312
                   C 290 328, 245 322, 200 322
                   C 155 322, 110 328, 90 312
                   C 65 285, 75 245, 130 216
                   C 120 205, 112 185, 120 162 Z"
                fill="url(#crocPattern)"
              />
            )}

            {/* Base Volumetric Light & Soft Shading */}
            <path
              d="M 120 162
                 Q 200 196 280 162
                 C 288 185, 280 205, 270 216
                 C 325 245, 335 285, 310 312
                 C 290 328, 245 322, 200 322
                 C 155 322, 110 328, 90 312
                 C 65 285, 75 245, 130 216
                 C 120 205, 112 185, 120 162 Z"
              fill="url(#leatherLight)"
            />

            {/* B. Deep Sculptural Folds and Pleats (Upper Section - cascading to cinch) */}
            <g id="balmain-upper-pleats">
              <path d="M 142 172 Q 148 195 152 216" stroke="rgba(0,0,0,0.35)" strokeWidth="3" fill="none" />
              <path d="M 144 172 Q 150 195 154 216" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" />

              <path d="M 170 182 Q 174 200 178 216" stroke="rgba(0,0,0,0.35)" strokeWidth="3.5" fill="none" />
              <path d="M 172 182 Q 176 200 180 216" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" fill="none" />

              <path d="M 230 182 Q 226 200 222 216" stroke="rgba(0,0,0,0.35)" strokeWidth="3.5" fill="none" />
              <path d="M 228 182 Q 224 200 220 216" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" fill="none" />

              <path d="M 258 172 Q 252 195 248 216" stroke="rgba(0,0,0,0.35)" strokeWidth="3" fill="none" />
              <path d="M 256 172 Q 250 195 246 216" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" fill="none" />
            </g>

            {/* C. Voluminous Lower Drapery & Folds (Expanding out into rich cloud pouch) */}
            <g id="balmain-lower-pleats">
              {/* Center deep drape valley */}
              <path
                d="M 195 220 Q 192 270 190 321"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M 205 220 Q 208 270 210 321"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M 200 220 Q 200 270 200 322"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Mid-Left Drape Flounce */}
              <path
                d="M 165 218 C 155 250, 145 285, 138 316"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="6"
                fill="none"
              />
              <path
                d="M 168 218 C 158 250, 148 285, 141 316"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2.2"
                fill="none"
              />

              {/* Far-Left Cloud Pillow Fold */}
              <path
                d="M 130 216 C 105 245, 95 275, 92 310"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M 132 216 C 108 245, 98 275, 95 310"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                fill="none"
              />

              {/* Mid-Right Drape Flounce */}
              <path
                d="M 235 218 C 245 250, 255 285, 262 316"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="6"
                fill="none"
              />
              <path
                d="M 232 218 C 242 250, 252 285, 259 316"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2.2"
                fill="none"
              />

              {/* Far-Right Cloud Pillow Fold */}
              <path
                d="M 270 216 C 295 245, 305 275, 308 310"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M 268 216 C 292 245, 302 275, 305 310"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2"
                fill="none"
              />
            </g>

            {/* D. Ruched Cinch Belt (Horizontal Band running across the waist) */}
            <g id="balmain-cinch-belt">
              {/* Belt shadow on lower body */}
              <path
                d="M 126 220 Q 200 227 274 220"
                fill="none"
                stroke="rgba(0,0,0,0.4)"
                strokeWidth="8"
                filter="blur(1.5px)"
              />
              {/* Leather Cinch Cord / Belt */}
              <path
                d="M 126 217 Q 200 223 274 217"
                fill="none"
                stroke={primaryHex}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 126 217 Q 200 223 274 217"
                fill="none"
                stroke="url(#leatherLight)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              {/* Top and bottom subtle edge stitching on the cinch belt */}
              <path
                d="M 128 215 Q 200 221 272 215"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />

              {/* Ruched gather micro-folds around the center clasp */}
              <path d="M 165 213 Q 170 217 172 222" stroke="rgba(0,0,0,0.45)" strokeWidth="2" fill="none" />
              <path d="M 174 214 Q 177 217 178 221" stroke="rgba(0,0,0,0.45)" strokeWidth="2" fill="none" />
              <path d="M 235 213 Q 230 217 228 222" stroke="rgba(0,0,0,0.45)" strokeWidth="2" fill="none" />
              <path d="M 226 214 Q 223 217 222 221" stroke="rgba(0,0,0,0.45)" strokeWidth="2" fill="none" />

              {/* Iconic Balmain Center Metallic Bar Clasp */}
              <g id="balmain-gold-bar" transform="translate(200, 219)">
                {/* Bar drop shadow */}
                <rect x="-24" y="-5" width="48" height="12" rx="4" fill="rgba(0,0,0,0.4)" filter="blur(1px)" />
                {/* Metallic Tube / Ingot Bar */}
                <rect
                  x="-23"
                  y="-6"
                  width="46"
                  height="12"
                  rx="3.5"
                  fill="url(#hardwareGradient)"
                  stroke="#111111"
                  strokeWidth="0.6"
                />
                {/* Specular highlight along top of bar */}
                <line x1="-20" y1="-4" x2="20" y2="-4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" />
                {/* Center luxury engraving groove & Balmain signature badge */}
                <rect x="-10" y="-2" width="20" height="4" rx="1" fill="#151515" fillOpacity="0.35" />
                <line x1="-6" y1="0" x2="6" y2="0" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.6" />
                {/* Left and Right hardware retaining collar rings */}
                <rect x="-22" y="-6.5" width="4" height="13" rx="1.5" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.4" />
                <rect x="18" y="-6.5" width="4" height="13" rx="1.5" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.4" />
              </g>
            </g>
          </g>
        )}

        {isCustomOrHobo && (
          <g id="crescent-body" className="transition-all duration-300">
            {/* Main Crescent / Hobo Half-Moon Silhouette */}
            <path
              d="M 108 170 C 100 235, 135 295, 200 295 C 265 295, 300 235, 292 170 C 265 214, 135 214, 108 170 Z"
              fill={primaryHex}
              className="transition-colors duration-300"
            />
            {/* Texture overlay */}
            {currentMaterial.texture === 'crosshatch' && (
              <path
                d="M 108 170 C 100 235, 135 295, 200 295 C 265 295, 300 235, 292 170 C 265 214, 135 214, 108 170 Z"
                fill="url(#saffianoPattern)"
              />
            )}
            {currentMaterial.texture === 'croc' && (
              <path
                d="M 108 170 C 100 235, 135 295, 200 295 C 265 295, 300 235, 292 170 C 265 214, 135 214, 108 170 Z"
                fill="url(#crocPattern)"
              />
            )}
            {/* Leather curved lighting */}
            <path
              d="M 108 170 C 100 235, 135 295, 200 295 C 265 295, 300 235, 292 170 C 265 214, 135 214, 108 170 Z"
              fill="url(#leatherLight)"
            />

            {/* Edge stitching around bottom curved contour */}
            <path
              d="M 112 176 C 105 233, 138 289, 200 289 C 262 289, 295 233, 288 176"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />

            {/* Top curved zipper track along the scooped dip */}
            <path
              d="M 116 174 C 145 214, 255 214, 284 174"
              fill="none"
              stroke="url(#hardwareGradient)"
              strokeWidth="3.5"
            />
            {/* Zipper puller tag */}
            <circle cx="160" cy="201" r="3.5" fill="url(#hardwareGradient)" />
            <rect x="158" y="203" width="4" height="10" rx="1.5" fill="url(#hardwareGradient)" />

            {/* D-Ring strap loops on the bag wings */}
            <rect x="110" y="166" width="7" height="12" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
            <rect x="283" y="166" width="7" height="12" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />

            {/* Iconic Center Vertical Leather Tab */}
            <path
              d="M 183 194 L 217 194 Q 219 194 219 200 L 219 238 Q 219 248 200 248 Q 181 248 181 238 L 181 200 Q 181 194 183 194 Z"
              fill={primaryHex}
              filter="drop-shadow(0 3px 5px rgba(0,0,0,0.3))"
            />
            {currentMaterial.texture === 'croc' && (
              <path
                d="M 183 194 L 217 194 Q 219 194 219 200 L 219 238 Q 219 248 200 248 Q 181 248 181 238 L 181 200 Q 181 194 183 194 Z"
                fill="url(#crocPattern)"
              />
            )}
            <path
              d="M 183 194 L 217 194 Q 219 194 219 200 L 219 238 Q 219 248 200 248 Q 181 248 181 238 L 181 200 Q 181 194 183 194 Z"
              fill="url(#leatherLight)"
            />
            {/* Stitching on the tab */}
            <path
              d="M 185 196 L 215 196 Q 217 196 217 200 L 217 236 Q 217 245 200 245 Q 183 245 183 236 L 183 200 Q 183 196 185 196 Z"
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeDasharray="2.5 2.5"
            />

            {/* Iconic Celine Triomphe Double-Arc Clasp Emblem */}
            <g id="triomphe-logo" transform="translate(200, 222)">
              {/* Center connector plate */}
              <rect x="-4" y="-7" width="8" height="14" rx="1.5" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
              {/* Left Arc */}
              <path d="M -3 -8 C -13 -8, -15 -4, -15 0 C -15 4, -13 8, -3 8" fill="none" stroke="url(#hardwareGradient)" strokeWidth="3.2" strokeLinecap="round" />
              {/* Right Arc */}
              <path d="M 3 -8 C 13 -8, 15 -4, 15 0 C 15 4, 13 8, 3 8" fill="none" stroke="url(#hardwareGradient)" strokeWidth="3.2" strokeLinecap="round" />
              {/* Center hardware stud */}
              <circle cx="0" cy="0" r="2.2" fill="url(#hardwareGradient)" />
            </g>
          </g>
        )}

        {/* 3. PERSONALIZED MONOGRAM RENDERING (EMBOSSED / FOIL / TEXT) */}
        {config.monogram.enabled && textLength > 0 && (
          <g id="monogram-text">
            {config.monogram.style === 'blind_emboss' ? (
              /* Photorealistic heat deboss into leather */
              <g>
                {/* Top inner deboss shadow (sunken depth) */}
                <text
                  x="200"
                  y={monogramY}
                  dy="-0.7"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily={fontFamily}
                  fontWeight="bold"
                  letterSpacing={letterSpacing}
                  fontSize={monogramFontSize}
                  fill="rgba(0,0,0,0.65)"
                >
                  {config.monogram.text.toUpperCase()}
                </text>
                {/* Bottom edge highlight reflection */}
                <text
                  x="200"
                  y={monogramY}
                  dy="0.8"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily={fontFamily}
                  fontWeight="bold"
                  letterSpacing={letterSpacing}
                  fontSize={monogramFontSize}
                  fill="rgba(255,255,255,0.35)"
                >
                  {config.monogram.text.toUpperCase()}
                </text>
                {/* Center sunken impression */}
                <text
                  x="200"
                  y={monogramY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily={fontFamily}
                  fontWeight="bold"
                  letterSpacing={letterSpacing}
                  fontSize={monogramFontSize}
                  fill="rgba(0,0,0,0.3)"
                >
                  {config.monogram.text.toUpperCase()}
                </text>
              </g>
            ) : (
              /* Hot stamped metallic foil (Gold or Silver) */
              <g>
                {/* Micro deboss groove shadow (underneath the foil) */}
                <text
                  x="200"
                  y={monogramY}
                  dy="0.8"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily={fontFamily}
                  fontWeight="bold"
                  letterSpacing={letterSpacing}
                  fontSize={monogramFontSize}
                  fill="rgba(0,0,0,0.5)"
                >
                  {config.monogram.text.toUpperCase()}
                </text>
                {/* Shimmering Metallic Foil Text with subtle specular drop shadow */}
                <text
                  x="200"
                  y={monogramY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily={fontFamily}
                  fontWeight="bold"
                  letterSpacing={letterSpacing}
                  fontSize={monogramFontSize}
                  fill={config.monogram.style === 'gold_foil' ? 'url(#goldFoil)' : 'url(#silverFoil)'}
                  filter="drop-shadow(0 1px 1px rgba(0,0,0,0.4))"
                >
                  {config.monogram.text.toUpperCase()}
                </text>
              </g>
            )}
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
      )}

      {/* Floating Info Badges */}
      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#1a1a26]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-stone-800 dark:text-white shadow-sm border border-stone-200/50 dark:border-stone-700 flex items-center gap-1.5 z-20">
        <span className="w-2.5 h-2.5 rounded-full inline-block border border-black/10 flex-shrink-0" style={{ backgroundColor: primaryHex }} />
        <span className="max-w-[90px] sm:max-w-none truncate">{colorDisplayName}</span>
      </div>

      <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#1a1a26]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold text-stone-800 dark:text-white shadow-sm border border-stone-200/50 dark:border-stone-700 flex items-center gap-1 sm:gap-1.5 z-20">
        <span>{currentSize.nameAr}</span>
        <span className="text-stone-400">|</span>
        <span className="text-amber-700 dark:text-amber-400">{currentHardware.nameAr}</span>
        <span className="text-stone-400">|</span>
        <span className="text-pink-600 dark:text-pink-400 font-medium">{currentStrap.nameAr}</span>
      </div>
    </div>
  );
};
