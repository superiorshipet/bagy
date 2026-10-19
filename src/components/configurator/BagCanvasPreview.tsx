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
}) => {
  const currentMaterial = MATERIALS.find((m) => m.id === config.materialId) || MATERIALS[0];
  const currentColor = COLORS.find((c) => c.id === config.primaryColorId) || COLORS[0];
  const currentHardware = HARDWARE_OPTIONS.find((h) => h.id === config.hardware) || HARDWARE_OPTIONS[0];
  const currentSize = SIZES.find((s) => s.id === config.size) || SIZES[1];
  const currentStrap = STRAPS.find((s) => s.id === config.strapId) || STRAPS[0];

  const primaryHex = config.customColorHex || (config.primaryColorId?.startsWith('#') ? config.primaryColorId : currentColor.hex);
  const handleHex = config.handleColorHex || (config.handleColorId ? COLORS.find((c) => c.id === config.handleColorId)?.hex : null) || primaryHex;
  const colorDisplayName = config.customColorName || (config.customColorHex ? `مخصص (${config.customColorHex})` : currentColor.nameAr);
  const hardwareColor = currentHardware.color;

  // Bag silhouette checks for all 12 categories
  const isTote = config.bagType === 'tote';
  const isCrossbody = config.bagType === 'crossbody' || config.bagType === 'mini';
  const isShoulder = config.bagType === 'shoulder';
  const isBackpack = config.bagType === 'backpack';
  const isClutch = config.bagType === 'clutch';
  const isBalmain = config.bagType === 'balmain' || config.bagType === 'vv' || config.bagType?.toLowerCase().includes('balmain');
  const isHobo = config.bagType === 'hobo' || config.bagType === 'crescent' || config.bagType === 'ava' || config.bagType === 'u';
  const isBucket = config.bagType === 'bucket';
  const isSaddle = config.bagType === 'saddle';
  const isSatchel = config.bagType === 'satchel';
  const isDuffel = config.bagType === 'duffel';

  // Scale factor based on chosen bag size
  const scaleMap = {
    mini: 0.82,
    small: 0.9,
    medium: 1.0,
    large: 1.12,
  };
  const sizeScale = scaleMap[config.size] || 1;

  // Monogram positioning & typography calculation
  const monogramY = isClutch
    ? 236
    : isTote
    ? 242
    : isCrossbody
    ? 278
    : isShoulder
    ? 252
    : isBucket
    ? 265
    : isSaddle
    ? 226
    : isSatchel
    ? 208
    : isDuffel
    ? 252
    : isBalmain
    ? 262
    : isHobo
    ? 270
    : 275;

  const textLength = config.monogram.text.trim().length;
  const monogramFontSize =
    textLength <= 2
      ? 14
      : textLength <= 4
      ? 12
      : textLength <= 7
      ? 10
      : textLength <= 12
      ? 8
      : textLength <= 18
      ? 6.5
      : Math.max(4.5, 14 - textLength * 0.42);

  const letterSpacing =
    textLength > 14
      ? '0.2px'
      : textLength > 8
      ? '1px'
      : config.monogram.font === 'script'
      ? '2px'
      : '4px';

  const fontFamily =
    config.monogram.font === 'serif'
      ? 'var(--font-playfair), "Playfair Display", Georgia, "Times New Roman", serif'
      : config.monogram.font === 'script'
      ? '"Brush Script MT", "Caveat", "Dancing Script", cursive'
      : 'var(--font-inter), Inter, system-ui, sans-serif';

  // Helper for applying leather textures & realistic lighting to any SVG path
  const renderMaterialOverlays = (pathD: string) => (
    <>
      {currentMaterial.texture === 'crosshatch' && (
        <path d={pathD} fill="url(#saffianoPattern)" pointerEvents="none" />
      )}
      {currentMaterial.texture === 'croc' && (
        <path d={pathD} fill="url(#crocPattern)" pointerEvents="none" />
      )}
      {currentMaterial.texture === 'pebbled' && (
        <path d={pathD} fill="url(#pebbledPattern)" pointerEvents="none" />
      )}
      {currentMaterial.texture === 'suede' && (
        <path d={pathD} fill="url(#suedePattern)" opacity="0.65" pointerEvents="none" />
      )}
      {currentMaterial.texture === 'metallic' && (
        <path d={pathD} fill="url(#metallicSheen)" opacity="0.75" pointerEvents="none" />
      )}
      <path d={pathD} fill="url(#leatherLight)" pointerEvents="none" />
    </>
  );

  // Helper for rendering luxury strap variations
  const renderStrapPath = (d: string, defaultWidth: number = 14) => {
    if (config.strapId === 'woven_guitar') {
      return (
        <g>
          <path d={d} fill="none" stroke="#181824" strokeWidth={defaultWidth + 6} strokeLinecap="round" />
          <path d={d} fill="none" stroke="url(#bohoJacquardPattern)" strokeWidth={defaultWidth + 2} strokeLinecap="round" />
        </g>
      );
    }
    if (config.strapId === 'chunky_chain') {
      return (
        <g>
          <path d={d} fill="none" stroke="#1a1a1a" strokeWidth={defaultWidth - 1} strokeLinecap="round" />
          <path d={d} fill="none" stroke="url(#hardwareGradient)" strokeWidth={defaultWidth - 3} strokeDasharray="6 8" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="2 12" strokeOpacity="0.85" />
        </g>
      );
    }
    if (config.strapId === 'pearl_chain') {
      return (
        <g>
          <path d={d} fill="none" stroke="url(#hardwareGradient)" strokeWidth="3" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#ffffff" strokeWidth="12" strokeDasharray="1 14" strokeLinecap="round" strokeOpacity="0.9" />
          <path d={d} fill="none" stroke="url(#pearlShine)" strokeWidth="11" strokeDasharray="1 14" strokeLinecap="round" />
          <path d={d} fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray="1 14" strokeLinecap="round" strokeOpacity="0.95" />
        </g>
      );
    }
    if (config.strapId === 'braided_leather') {
      return (
        <g>
          <path d={d} fill="none" stroke={handleHex} strokeWidth={defaultWidth + 4} strokeLinecap="round" />
          <path d={d} fill="none" stroke="url(#braidedPattern)" strokeWidth={defaultWidth + 4} strokeLinecap="round" />
          <path d={d} fill="none" stroke="url(#leatherLight)" strokeWidth={defaultWidth + 4} strokeLinecap="round" />
        </g>
      );
    }
    // Default matching leather strap with edge stitching
    return (
      <g>
        <path d={d} fill="none" stroke={handleHex} strokeWidth={defaultWidth} strokeLinecap="round" />
        <path d={d} fill="none" stroke="url(#leatherLight)" strokeWidth={defaultWidth} strokeLinecap="round" />
        <path d={d} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="1" strokeDasharray="3 3" />
      </g>
    );
  };

  return (
    <div className={`relative w-full aspect-[4/3] flex items-center justify-center p-2.5 sm:p-5 bg-gradient-to-b from-[#f9f7f4] to-[#f0ece5] dark:from-[#1b1b26] dark:to-[#12121c] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner ${className}`}>
      {/* Background Studio Lighting & Pedestal Shadow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.85)_0%,rgba(240,235,225,0.3)_60%,transparent_100%)] pointer-events-none" />
      <div className="absolute bottom-4 w-4/5 h-8 bg-black/10 rounded-[100%] blur-xl pointer-events-none" />

      {/* 3D Interactive SVG Canvas */}
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

          {/* Pebbled full-grain texture pattern */}
          <pattern id="pebbledPattern" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="rgba(0,0,0,0.12)" />
            <circle cx="2.2" cy="1.8" r="0.7" fill="rgba(255,255,255,0.14)" />
            <circle cx="5.5" cy="5.5" r="1.3" fill="rgba(0,0,0,0.12)" />
            <circle cx="5.7" cy="5.2" r="0.8" fill="rgba(255,255,255,0.14)" />
          </pattern>

          {/* Velvet suede soft texture pattern */}
          <pattern id="suedePattern" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="rgba(0,0,0,0.06)" />
            <rect x="0" y="0" width="2" height="2" fill="rgba(255,255,255,0.06)" />
            <rect x="2" y="2" width="2" height="2" fill="rgba(255,255,255,0.06)" />
          </pattern>

          {/* Mirror metallic sheen gradient */}
          <linearGradient id="metallicSheen" x1="0%" y1="0%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="65%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

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
            <path d="M 0 14 L 14 0 L 28 14 L 14 28 Z" fill="#d97706" />
            <path d="M 7 14 L 14 7 L 21 14 L 14 21 Z" fill="#ec4899" />
            <circle cx="14" cy="14" r="3" fill="#06b6d4" />
            <line x1="0" y1="0" x2="28" y2="0" stroke="#f59e0b" strokeWidth="2" />
            <line x1="0" y1="28" x2="28" y2="28" stroke="#f59e0b" strokeWidth="2" />
          </pattern>

          {/* Hand-Braided Leather Pattern */}
          <pattern id="braidedPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <path d="M0 0 L6 6 L0 12 M6 0 L12 6 L6 12" stroke="rgba(0,0,0,0.28)" strokeWidth="1.8" fill="none" />
            <path d="M0 0 L6 6 L0 12 M6 0 L12 6 L6 12" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" fill="none" />
          </pattern>

          {/* Luminous Pearl Radial Gradient */}
          <radialGradient id="pearlShine" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fdfbf7" />
            <stop offset="80%" stopColor="#e8e2d5" />
            <stop offset="100%" stopColor="#c4baa8" />
          </radialGradient>
        </defs>

        {/* 1. BAG HANDLES / STRAP (Behind Body) */}
        {isTote && (
          <g className="transition-all duration-300">
            {renderStrapPath('M 140 160 C 140 60, 260 60, 260 160', 16)}
          </g>
        )}

        {isShoulder && (
          <g className="transition-all duration-300">
            {renderStrapPath('M 130 180 C 120 70, 280 70, 270 180', 14)}
          </g>
        )}

        {isCrossbody && (
          <g className="transition-all duration-300">
            {renderStrapPath('M 115 180 C 95 40, 305 40, 285 180', 14)}
          </g>
        )}

        {isClutch && (
          <g className="transition-all duration-300">
            {config.strapId === 'chunky_chain' || config.strapId === 'pearl_chain' ? (
              renderStrapPath('M 85 180 C 65 140, 65 90, 85 80 C 110 70, 150 100, 160 115', 8)
            ) : (
              <g>
                <path d="M 85 180 C 60 170, 45 140, 50 110 C 55 85, 75 80, 85 115" fill="none" stroke={handleHex} strokeWidth="6" strokeLinecap="round" />
                <path d="M 85 180 C 60 170, 45 140, 50 110 C 55 85, 75 80, 85 115" fill="none" stroke="url(#leatherLight)" strokeWidth="6" strokeLinecap="round" />
                <circle cx="85" cy="180" r="4" fill="url(#hardwareGradient)" />
              </g>
            )}
          </g>
        )}

        {isBackpack && (
          <g>
            <path d="M 170 140 C 170 100, 230 100, 230 140" fill="none" stroke={handleHex} strokeWidth="12" strokeLinecap="round" />
            <path d="M 170 140 C 170 100, 230 100, 230 140" fill="none" stroke="url(#leatherLight)" strokeWidth="12" strokeLinecap="round" />
            {renderStrapPath('M 140 180 C 110 130, 95 240, 120 300', 10)}
            {renderStrapPath('M 260 180 C 290 130, 305 240, 280 300', 10)}
          </g>
        )}

        {isBalmain && (
          <g id="balmain-handle-and-interior" className="transition-all duration-300">
            <path d="M 125 158 Q 200 198 275 158 Q 200 135 125 158 Z" fill="#101016" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.6))" />
            <path d="M 125 158 Q 200 198 275 158" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
            {renderStrapPath('M 122 170 C 110 50, 290 50, 278 170', 20)}
            <g id="balmain-handle-buckle">
              <rect x="114" y="108" width="12" height="18" rx="3" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))" />
              <line x1="114" y1="117" x2="126" y2="117" stroke="#111" strokeWidth="2" />
            </g>
          </g>
        )}

        {isHobo && (
          <g id="crescent-strap" className="transition-all duration-300">
            {renderStrapPath('M 116 172 C 112 50, 288 50, 284 172', 15)}
            <rect x="123" y="102" width="10" height="15" rx="2" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.5" />
            <line x1="123" y1="110" x2="133" y2="110" stroke="#111" strokeWidth="1.5" />
          </g>
        )}

        {isBucket && (
          <g id="bucket-strap" className="transition-all duration-300">
            {renderStrapPath('M 125 175 C 120 50, 280 50, 275 175', 14)}
            <rect x="120" y="170" width="8" height="14" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
            <rect x="272" y="170" width="8" height="14" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
          </g>
        )}

        {isSaddle && (
          <g id="saddle-strap" className="transition-all duration-300">
            {renderStrapPath('M 118 165 C 112 50, 288 50, 282 165', 14)}
            <circle cx="118" cy="165" r="7" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
            <circle cx="118" cy="165" r="3.5" fill="#151515" />
            <circle cx="282" cy="165" r="7" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
            <circle cx="282" cy="165" r="3.5" fill="#151515" />
          </g>
        )}

        {isSatchel && (
          <g id="satchel-strap-and-handle" className="transition-all duration-300">
            {renderStrapPath('M 120 185 C 110 40, 290 40, 280 185', 12)}
            <path d="M 160 165 C 160 95, 240 95, 240 165" fill="none" stroke={handleHex} strokeWidth="14" strokeLinecap="round" />
            <path d="M 160 165 C 160 95, 240 95, 240 165" fill="none" stroke="url(#leatherLight)" strokeWidth="14" strokeLinecap="round" />
            <rect x="154" y="158" width="12" height="12" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
            <rect x="234" y="158" width="12" height="12" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
          </g>
        )}

        {isDuffel && (
          <g id="duffel-straps" className="transition-all duration-300">
            {renderStrapPath('M 95 195 C 90 35, 310 35, 305 195', 14)}
            <path d="M 140 185 C 140 100, 260 100, 260 185" fill="none" stroke={handleHex} strokeWidth="13" strokeLinecap="round" />
            <path d="M 140 185 C 140 100, 260 100, 260 185" fill="none" stroke="url(#leatherLight)" strokeWidth="13" strokeLinecap="round" />
            <rect x="185" y="94" width="30" height="14" rx="4" fill={handleHex} stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
            <circle cx="200" cy="101" r="2.5" fill="url(#hardwareGradient)" />
          </g>
        )}

        {/* 2. BAG MAIN BODY SILHOUETTES */}
        {isTote && (
          <g id="tote-body">
            <path d="M 110 150 L 290 150 L 275 310 Q 270 325 250 325 L 150 325 Q 130 325 125 310 Z" fill={primaryHex} className="transition-colors duration-300" />
            {renderMaterialOverlays("M 110 150 L 290 150 L 275 310 Q 270 325 250 325 L 150 325 Q 130 325 125 310 Z")}
            <path d="M 110 150 L 290 150" stroke="rgba(0,0,0,0.25)" strokeWidth="4" />
            <path d="M 112 155 L 288 155" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="135" y="152" width="10" height="16" rx="2" fill="url(#hardwareGradient)" />
            <rect x="255" y="152" width="10" height="16" rx="2" fill="url(#hardwareGradient)" />
          </g>
        )}

        {isCrossbody && (
          <g id="crossbody-body">
            <path d="M 115 170 Q 115 155 130 155 L 270 155 Q 285 155 285 170 L 285 285 Q 285 310 260 310 L 140 310 Q 115 310 115 285 Z" fill={primaryHex} className="transition-colors duration-300" />
            {renderMaterialOverlays("M 115 170 Q 115 155 130 155 L 270 155 Q 285 155 285 170 L 285 285 Q 285 310 260 310 L 140 310 Q 115 310 115 285 Z")}
            <path d="M 115 160 L 285 160 L 285 220 Q 200 265 115 220 Z" fill={primaryHex} filter="drop-shadow(0px 5px 6px rgba(0,0,0,0.25))" />
            {renderMaterialOverlays("M 115 160 L 285 160 L 285 220 Q 200 265 115 220 Z")}
            <path d="M 118 162 L 282 162 L 282 216 Q 200 260 118 216 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="3 3" />
            <ellipse cx="200" cy="242" rx="14" ry="11" fill="url(#hardwareGradient)" stroke="#1a1a1a" strokeWidth="0.5" />
            <rect x="194" y="238" width="12" height="8" rx="2" fill="#111111" />
            <circle cx="200" cy="242" r="3" fill="url(#hardwareGradient)" />
          </g>
        )}

        {isShoulder && (
          <g id="shoulder-body">
            <path d="M 110 190 Q 110 170 135 170 L 265 170 Q 290 170 290 190 L 290 280 Q 290 305 265 305 L 135 305 Q 110 305 110 280 Z" fill={primaryHex} />
            {renderMaterialOverlays("M 110 190 Q 110 170 135 170 L 265 170 Q 290 170 290 190 L 290 280 Q 290 305 265 305 L 135 305 Q 110 305 110 280 Z")}
            <rect x="130" y="167" width="140" height="6" rx="2" fill="url(#hardwareGradient)" />
            <circle cx="200" cy="225" r="12" fill="url(#hardwareGradient)" />
          </g>
        )}

        {isBackpack && (
          <g id="backpack-body">
            <path d="M 130 315 L 270 315 Q 285 315 285 295 L 280 200 Q 275 140 200 140 Q 125 140 120 200 L 115 295 Q 115 315 130 315 Z" fill={primaryHex} />
            {renderMaterialOverlays("M 130 315 L 270 315 Q 285 315 285 295 L 280 200 Q 275 140 200 140 Q 125 140 120 200 L 115 295 Q 115 315 130 315 Z")}
            <path d="M 140 240 L 260 240 Q 270 240 270 255 L 268 300 Q 268 310 255 310 L 145 310 Q 132 310 132 300 L 130 255 Q 130 240 140 240 Z" fill={primaryHex} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.2))" />
            {renderMaterialOverlays("M 140 240 L 260 240 Q 270 240 270 255 L 268 300 Q 268 310 255 310 L 145 310 Q 132 310 132 300 L 130 255 Q 130 240 140 240 Z")}
            <line x1="145" y1="245" x2="255" y2="245" stroke="url(#hardwareGradient)" strokeWidth="3" />
            <circle cx="200" cy="245" r="5" fill="url(#hardwareGradient)" />
          </g>
        )}

        {isClutch && (
          <g id="clutch-body">
            <rect x="85" y="115" width="230" height="150" rx="12" fill={primaryHex} />
            {renderMaterialOverlays("M 85 115 L 315 115 L 315 265 L 85 265 Z")}
            <path d="M 85 115 L 315 115 L 200 205 Z" fill={primaryHex} filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))" />
            {renderMaterialOverlays("M 85 115 L 315 115 L 200 205 Z")}
            <path d="M 89 117 L 311 117 L 200 201 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="200" cy="205" r="9" fill="url(#hardwareGradient)" stroke="#1a1a1a" strokeWidth="0.5" />
            <circle cx="200" cy="205" r="4" fill="#111111" />
          </g>
        )}

        {isBalmain && (
          <g id="balmain-body" className="transition-all duration-300">
            <path
              d="M 120 162 Q 200 196 280 162 C 288 185, 280 205, 270 216 C 325 245, 335 285, 310 312 C 290 328, 245 322, 200 322 C 155 322, 110 328, 90 312 C 65 285, 75 245, 130 216 C 120 205, 112 185, 120 162 Z"
              fill={primaryHex}
              filter="drop-shadow(0 12px 18px rgba(0,0,0,0.35))"
            />
            {renderMaterialOverlays("M 120 162 Q 200 196 280 162 C 288 185, 280 205, 270 216 C 325 245, 335 285, 310 312 C 290 328, 245 322, 200 322 C 155 322, 110 328, 90 312 C 65 285, 75 245, 130 216 C 120 205, 112 185, 120 162 Z")}

            {/* Balmain pleats */}
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

            {/* Balmain Cinch & Gold Ingot Bar */}
            <g id="balmain-cinch-belt">
              <path d="M 126 217 Q 200 223 274 217" fill="none" stroke={primaryHex} strokeWidth="6" strokeLinecap="round" />
              <path d="M 126 217 Q 200 223 274 217" fill="none" stroke="url(#leatherLight)" strokeWidth="6" strokeLinecap="round" />
              <g id="balmain-gold-bar" transform="translate(200, 219)">
                <rect x="-24" y="-5" width="48" height="12" rx="4" fill="rgba(0,0,0,0.4)" filter="blur(1px)" />
                <rect x="-23" y="-6" width="46" height="12" rx="3.5" fill="url(#hardwareGradient)" stroke="#111111" strokeWidth="0.6" />
                <line x1="-20" y1="-4" x2="20" y2="-4" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.85" />
                <rect x="-22" y="-6.5" width="4" height="13" rx="1.5" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.4" />
                <rect x="18" y="-6.5" width="4" height="13" rx="1.5" fill="url(#hardwareGradient)" stroke="#000" strokeWidth="0.4" />
              </g>
            </g>
          </g>
        )}

        {isHobo && (
          <g id="crescent-body" className="transition-all duration-300">
            <path
              d="M 108 170 C 100 235, 135 295, 200 295 C 265 295, 300 235, 292 170 C 265 214, 135 214, 108 170 Z"
              fill={primaryHex}
              className="transition-colors duration-300"
            />
            {renderMaterialOverlays("M 108 170 C 100 235, 135 295, 200 295 C 265 295, 300 235, 292 170 C 265 214, 135 214, 108 170 Z")}
            <path d="M 112 176 C 105 233, 138 289, 200 289 C 262 289, 295 233, 288 176" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M 116 174 C 145 214, 255 214, 284 174" fill="none" stroke="url(#hardwareGradient)" strokeWidth="3.5" />
            <circle cx="160" cy="201" r="3.5" fill="url(#hardwareGradient)" />
            <rect x="158" y="203" width="4" height="10" rx="1.5" fill="url(#hardwareGradient)" />
            <rect x="110" y="166" width="7" height="12" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
            <rect x="283" y="166" width="7" height="12" rx="2" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
            <g id="triomphe-logo" transform="translate(200, 222)">
              <rect x="-4" y="-7" width="8" height="14" rx="1.5" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
              <path d="M -3 -8 C -13 -8, -15 -4, -15 0 C -15 4, -13 8, -3 8" fill="none" stroke="url(#hardwareGradient)" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M 3 -8 C 13 -8, 15 -4, 15 0 C 15 4, 13 8, 3 8" fill="none" stroke="url(#hardwareGradient)" strokeWidth="3.2" strokeLinecap="round" />
              <circle cx="0" cy="0" r="2.2" fill="url(#hardwareGradient)" />
            </g>
          </g>
        )}

        {isBucket && (
          <g id="bucket-body" className="transition-all duration-300">
            <path
              d="M 135 155 Q 200 170 265 155 L 280 290 Q 282 315 200 315 Q 118 315 120 290 Z"
              fill={primaryHex}
              filter="drop-shadow(0 10px 15px rgba(0,0,0,0.3))"
            />
            {renderMaterialOverlays("M 135 155 Q 200 170 265 155 L 280 290 Q 282 315 200 315 Q 118 315 120 290 Z")}
            <path d="M 135 155 Q 200 170 265 155 Q 200 142 135 155 Z" fill="#14141c" />
            <path d="M 135 155 Q 200 170 265 155" fill="none" stroke={handleHex} strokeWidth="3" />
            {/* Soft vertical gathers */}
            <path d="M 160 170 Q 165 240 162 310" stroke="rgba(0,0,0,0.2)" strokeWidth="3" fill="none" />
            <path d="M 161 170 Q 166 240 163 310" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
            <path d="M 240 170 Q 235 240 238 310" stroke="rgba(0,0,0,0.2)" strokeWidth="3" fill="none" />
            <path d="M 239 170 Q 234 240 237 310" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
            {/* Drawstring eyelets */}
            <circle cx="155" cy="180" r="4.5" fill="none" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
            <circle cx="185" cy="186" r="4.5" fill="none" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
            <circle cx="215" cy="186" r="4.5" fill="none" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
            <circle cx="245" cy="180" r="4.5" fill="none" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
            {/* Cinch cord */}
            <path d="M 148 178 Q 200 190 252 178" fill="none" stroke={handleHex} strokeWidth="4" />
            <path d="M 195 190 Q 192 215 190 236" fill="none" stroke={handleHex} strokeWidth="3.5" />
            <path d="M 205 190 Q 208 215 210 236" fill="none" stroke={handleHex} strokeWidth="3.5" />
            <rect x="187" y="235" width="6" height="12" rx="2" fill="url(#hardwareGradient)" />
            <rect x="207" y="235" width="6" height="12" rx="2" fill="url(#hardwareGradient)" />
            <path d="M 125 295 Q 200 320 275 295" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="2" />
          </g>
        )}

        {isSaddle && (
          <g id="saddle-body" className="transition-all duration-300">
            <path d="M 115 160 L 285 160 L 285 235 C 285 305, 115 305, 115 235 Z" fill={primaryHex} />
            {renderMaterialOverlays("M 115 160 L 285 160 L 285 235 C 285 305, 115 305, 115 235 Z")}
            {/* Sculpted Saddle Curved Flap */}
            <path d="M 115 160 L 285 160 L 285 218 C 285 290, 210 282, 115 240 Z" fill={primaryHex} filter="drop-shadow(0 6px 10px rgba(0,0,0,0.3))" />
            {renderMaterialOverlays("M 115 160 L 285 160 L 285 218 C 285 290, 210 282, 115 240 Z")}
            <path d="M 118 163 L 282 163 L 282 215 C 282 284, 210 277, 118 237 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeDasharray="3 3" />
            {/* Stirrup hardware charm */}
            <g id="saddle-stirrup" transform="translate(210, 262)">
              <rect x="-2" y="-12" width="4" height="14" rx="1" fill={handleHex} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
              <path d="M -7 2 L 7 2 C 7 12, -7 12, -7 2 Z" fill="none" stroke="url(#hardwareGradient)" strokeWidth="3" strokeLinecap="round" />
            </g>
          </g>
        )}

        {isSatchel && (
          <g id="satchel-body" className="transition-all duration-300">
            <path d="M 115 168 L 285 168 L 274 312 Q 270 322 250 322 L 150 322 Q 130 322 126 312 Z" fill={primaryHex} />
            {renderMaterialOverlays("M 115 168 L 285 168 L 274 312 Q 270 322 250 322 L 150 322 Q 130 322 126 312 Z")}
            {/* Upper Structured Flap */}
            <path d="M 115 168 L 285 168 L 282 232 L 118 232 Z" fill={primaryHex} filter="drop-shadow(0 5px 8px rgba(0,0,0,0.3))" />
            {renderMaterialOverlays("M 115 168 L 285 168 L 282 232 L 118 232 Z")}
            <rect x="120" y="170" width="160" height="60" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="3 3" />
            {/* Dual vertical straps with mini buckles */}
            <rect x="145" y="168" width="12" height="105" rx="3" fill={handleHex} filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.25))" />
            <rect x="145" y="168" width="12" height="105" rx="3" fill="url(#leatherLight)" />
            <rect x="143" y="224" width="16" height="14" rx="2" fill="none" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
            <rect x="243" y="168" width="12" height="105" rx="3" fill={handleHex} filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.25))" />
            <rect x="243" y="168" width="12" height="105" rx="3" fill="url(#leatherLight)" />
            <rect x="241" y="224" width="16" height="14" rx="2" fill="none" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
            {/* Lock hardware */}
            <g id="satchel-lock" transform="translate(200, 232)">
              <rect x="-10" y="-10" width="20" height="22" rx="3" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.5" />
              <circle cx="0" cy="-2" r="3" fill="#111" />
              <line x1="0" y1="-2" x2="0" y2="4" stroke="#111" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {isDuffel && (
          <g id="duffel-body" className="transition-all duration-300">
            <path d="M 90 205 C 90 160, 310 160, 310 205 L 310 285 C 310 315, 90 315, 90 285 Z" fill={primaryHex} />
            {renderMaterialOverlays("M 90 205 C 90 160, 310 160, 310 205 L 310 285 C 310 315, 90 315, 90 285 Z")}
            {/* Barrel rounded end caps */}
            <ellipse cx="92" cy="245" rx="8" ry="40" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
            <ellipse cx="308" cy="245" rx="8" ry="40" fill={primaryHex} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
            {/* Reinforcing vertical leather bands */}
            <rect x="142" y="165" width="16" height="140" fill={handleHex} />
            <rect x="142" y="165" width="16" height="140" fill="url(#leatherLight)" />
            <line x1="144" y1="165" x2="144" y2="305" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="156" y1="165" x2="156" y2="305" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
            <rect x="242" y="165" width="16" height="140" fill={handleHex} />
            <rect x="242" y="165" width="16" height="140" fill="url(#leatherLight)" />
            <line x1="244" y1="165" x2="244" y2="305" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="256" y1="165" x2="256" y2="305" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" strokeDasharray="3 3" />
            {/* Top Zipper track */}
            <line x1="95" y1="185" x2="305" y2="185" stroke="url(#hardwareGradient)" strokeWidth="4" />
            <circle cx="200" cy="185" r="5" fill="url(#hardwareGradient)" />
            <rect x="144" y="180" width="12" height="10" rx="2" fill="url(#hardwareGradient)" />
            <rect x="244" y="180" width="12" height="10" rx="2" fill="url(#hardwareGradient)" />
          </g>
        )}

        {/* 3. PERSONALIZED MONOGRAM RENDERING (EMBOSSED / FOIL / TEXT) */}
        {config.monogram.enabled && textLength > 0 && (
          <g id="monogram-text">
            {config.monogram.style === 'blind_emboss' ? (
              <g>
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
              <g>
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

        {/* 4. LUXURY ADDONS & HARDWARE ACCENTS */}
        {/* Leather luggage tag */}
        {config.selectedAddonIds.includes('bag_charm') && (
          <g id="addon-bag-charm" transform="translate(130, 160)">
            <line x1="10" y1="0" x2="18" y2="35" stroke="url(#hardwareGradient)" strokeWidth="2.5" />
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
            <circle cx="18" cy="50" r="4" fill="url(#goldFoil)" />
          </g>
        )}

        {/* Leather Tassel Charm */}
        {config.selectedAddonIds.includes('tassel_charm') && (
          <g id="addon-tassel-charm" transform="translate(136, 162)">
            <line x1="4" y1="0" x2="8" y2="28" stroke="url(#hardwareGradient)" strokeWidth="2" />
            <circle cx="8" cy="30" r="4" fill="url(#hardwareGradient)" />
            <rect x="4" y="33" width="8" height="26" rx="2" fill={primaryHex} filter="drop-shadow(1px 2px 3px rgba(0,0,0,0.3))" />
            <line x1="6" y1="36" x2="6" y2="59" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
            <line x1="8" y1="36" x2="8" y2="59" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
            <line x1="10" y1="36" x2="10" y2="59" stroke="rgba(0,0,0,0.35)" strokeWidth="0.8" />
          </g>
        )}

        {/* Silk Twilly Scarf wrapped around handle */}
        {config.selectedAddonIds.includes('silk_twilly') && (
          <g id="addon-silk-twilly">
            <path d="M 132 145 Q 140 140 148 146 Q 142 152 132 145 Z" fill="#d97706" stroke="#ec4899" strokeWidth="1" />
            <path
              d="M 138 145 C 132 165, 126 190, 122 215 Q 120 224 127 221 C 134 218, 137 185, 140 148 Z"
              fill="#ec4899"
              stroke="#d97706"
              strokeWidth="0.8"
              filter="drop-shadow(2px 3px 4px rgba(0,0,0,0.25))"
            />
          </g>
        )}

        {/* Protective Base Metal Studs */}
        {config.selectedAddonIds.includes('base_studs') && (
          <g id="addon-base-studs">
            <ellipse cx="140" cy="318" rx="6" ry="2.8" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.4" />
            <ellipse cx="260" cy="318" rx="6" ry="2.8" fill="url(#hardwareGradient)" stroke="#111" strokeWidth="0.4" />
          </g>
        )}
      </svg>

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
