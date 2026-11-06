'use client';

import React from 'react';
import { AvatarConfig } from '@/types';

interface Avatar3DRendererProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function Avatar3DRenderer({
  config,
  size = 'md',
  className = '',
}: Avatar3DRendererProps) {
  const isBoy = config.gender === 'boy';

  // Sizing map
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-36 h-36',
    xl: 'w-56 h-56',
  };

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full filter drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background Glow */}
          <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ea4c89" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ea4c89" stopOpacity="0" />
          </radialGradient>

          {/* Skin Gradients */}
          <linearGradient id="skinBoy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fed7aa" />
            <stop offset="100%" stopColor="#fba76a" />
          </linearGradient>
          <linearGradient id="skinGirl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffedd5" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>

          {/* Gold Crown Gradient */}
          <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#a16207" />
          </linearGradient>

          {/* Cyber Neon Gradient */}
          <linearGradient id="cyberGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>

          {/* Fire Wings Gradient */}
          <linearGradient id="fireGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          {/* Hair Gradients */}
          <linearGradient id="hairBoy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1c1917" />
          </linearGradient>
          <linearGradient id="hairGirl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" />
            <stop offset="100%" stopColor="#292524" />
          </linearGradient>
        </defs>

        {/* 1. LAYER: AURA / WINGS (Back) */}
        {config.aura === 'fire_wings' && (
          <g className="animate-pulse">
            {/* Left Wing */}
            <path
              d="M 60 110 C 20 80, 5 30, 30 10 C 45 40, 55 70, 75 95 Z"
              fill="url(#fireGrad)"
              opacity="0.9"
            />
            <path
              d="M 50 120 C 15 110, 5 60, 20 40 C 35 70, 50 95, 65 110 Z"
              fill="url(#fireGrad)"
              opacity="0.75"
            />
            {/* Right Wing */}
            <path
              d="M 140 110 C 180 80, 195 30, 170 10 C 155 40, 145 70, 125 95 Z"
              fill="url(#fireGrad)"
              opacity="0.9"
            />
            <path
              d="M 150 120 C 185 110, 195 60, 180 40 C 165 70, 150 95, 135 110 Z"
              fill="url(#fireGrad)"
              opacity="0.75"
            />
          </g>
        )}

        {config.aura === 'neon_glow' && (
          <ellipse
            cx="100"
            cy="100"
            rx="90"
            ry="90"
            fill="none"
            stroke="url(#cyberGrad)"
            strokeWidth="5"
            strokeDasharray="16 8"
            opacity="0.8"
          />
        )}

        {config.aura === 'golden_sparkles' && (
          <g>
            <circle cx="35" cy="40" r="4" fill="#fbbf24" className="animate-ping" />
            <circle cx="165" cy="45" r="5" fill="#fef08a" />
            <circle cx="25" cy="120" r="3" fill="#f59e0b" />
            <circle cx="175" cy="115" r="4" fill="#fbbf24" />
            <circle cx="100" cy="15" r="5" fill="#fde047" />
          </g>
        )}

        {/* 2. LAYER: GIRL'S BACK HAIR */}
        {!isBoy && (
          <path
            d="M 55 80 C 45 110, 40 160, 50 175 C 60 180, 70 140, 75 115 Z M 145 80 C 155 110, 160 160, 150 175 C 140 180, 130 140, 125 115 Z"
            fill="url(#hairGirl)"
          />
        )}

        {/* 3. LAYER: BODY & NECK */}
        {/* Neck */}
        <rect
          x="88"
          y="110"
          width="24"
          height="22"
          rx="6"
          fill={isBoy ? 'url(#skinBoy)' : 'url(#skinGirl)'}
        />

        {/* 4. LAYER: OUTFIT / CLOTHES */}
        {config.outfit === 'casual' && (
          <g>
            {/* T-Shirt */}
            <path
              d="M 50 150 L 70 125 L 88 132 L 112 132 L 130 125 L 150 150 L 140 195 L 60 195 Z"
              fill="#0d0c22"
            />
            {/* Collar Accent */}
            <path d="M 88 132 Q 100 144 112 132 Z" fill="#ea4c89" />
            <text x="100" y="165" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">PREPORA</text>
          </g>
        )}

        {config.outfit === 'suit' && (
          <g>
            {/* Dark Suit Jacket */}
            <path
              d="M 50 150 L 70 122 L 88 128 L 112 128 L 130 122 L 150 150 L 142 195 L 58 195 Z"
              fill="#1e1b4b"
            />
            {/* White Shirt Collar */}
            <polygon points="88,128 100,148 112,128" fill="#ffffff" />
            {/* Red Tie */}
            <polygon points="97,140 103,140 105,178 100,185 95,178" fill="#e11d48" />
          </g>
        )}

        {config.outfit === 'hoodie' && (
          <g>
            {/* Harvard/Cambridge Hoodie */}
            <path
              d="M 48 152 L 68 120 L 86 130 L 114 130 L 132 120 L 152 152 L 142 195 L 58 195 Z"
              fill="#831843"
            />
            {/* Hood collar */}
            <path d="M 80 126 C 90 142, 110 142, 120 126 Z" fill="#9d174d" />
            <circle cx="95" cy="148" r="2.5" fill="#ffffff" />
            <circle cx="105" cy="148" r="2.5" fill="#ffffff" />
            <text x="100" y="172" textAnchor="middle" fill="#fbcfe8" fontSize="10" fontWeight="900">BAND 9</text>
          </g>
        )}

        {config.outfit === 'cyber_jacket' && (
          <g>
            {/* Cyberpunk Bomber */}
            <path
              d="M 46 150 L 68 120 L 88 126 L 112 126 L 132 120 L 154 150 L 144 195 L 56 195 Z"
              fill="#09090b"
            />
            {/* Neon Zipper & stripes */}
            <line x1="100" y1="126" x2="100" y2="195" stroke="#06b6d4" strokeWidth="3" />
            <line x1="68" y1="130" x2="56" y2="170" stroke="#f43f5e" strokeWidth="2.5" />
            <line x1="132" y1="130" x2="144" y2="170" stroke="#f43f5e" strokeWidth="2.5" />
          </g>
        )}

        {/* 5. LAYER: HEAD & FACE */}
        {/* Head Base */}
        <ellipse
          cx="100"
          cy="85"
          rx="38"
          ry="44"
          fill={isBoy ? 'url(#skinBoy)' : 'url(#skinGirl)'}
        />

        {/* Ears */}
        <circle cx="62" cy="88" r="9" fill={isBoy ? 'url(#skinBoy)' : 'url(#skinGirl)'} />
        <circle cx="138" cy="88" r="9" fill={isBoy ? 'url(#skinBoy)' : 'url(#skinGirl)'} />
        {!isBoy && (
          <>
            {/* Cute Earrings */}
            <circle cx="62" cy="95" r="2.5" fill="#eab308" />
            <circle cx="138" cy="95" r="2.5" fill="#eab308" />
          </>
        )}

        {/* Eyes */}
        <g>
          {/* Eyeballs */}
          <ellipse cx="86" cy="82" rx="5" ry="6" fill="#1e293b" />
          <ellipse cx="114" cy="82" rx="5" ry="6" fill="#1e293b" />
          {/* Iris sparkles */}
          <circle cx="84.5" cy="80" r="2" fill="#ffffff" />
          <circle cx="112.5" cy="80" r="2" fill="#ffffff" />
        </g>

        {/* Eyebrows */}
        <path d="M 79 73 Q 86 69 93 73" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 107 73 Q 114 69 121 73" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />

        {/* Nose */}
        <path d="M 100 85 L 98 92 L 102 92" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Friendly Smile */}
        <path d="M 92 100 Q 100 108 108 100" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        {/* Blush cheeks */}
        <ellipse cx="78" cy="94" rx="5" ry="3" fill="#f43f5e" opacity="0.35" />
        <ellipse cx="122" cy="94" rx="5" ry="3" fill="#f43f5e" opacity="0.35" />

        {/* 6. LAYER: FRONT HAIR */}
        {isBoy ? (
          <g>
            {/* Boy Cool Modern Haircut */}
            <path
              d="M 64 74 C 62 48, 80 40, 100 40 C 122 40, 138 48, 136 74 C 130 60, 116 55, 100 56 C 84 57, 72 63, 64 74 Z"
              fill="url(#hairBoy)"
            />
            {/* Side fringe */}
            <path d="M 70 65 L 85 70 L 98 62 L 115 70 L 132 64 Z" fill="url(#hairBoy)" />
          </g>
        ) : (
          <g>
            {/* Girl Gorgeous Hair with Bangs */}
            <path
              d="M 60 76 C 58 46, 80 38, 100 38 C 122 38, 142 46, 140 76 C 132 58, 115 54, 100 55 C 85 54, 68 58, 60 76 Z"
              fill="url(#hairGirl)"
            />
            <path d="M 62 70 C 72 78, 84 80, 92 73 C 100 82, 118 80, 138 68 C 130 62, 118 60, 100 62 C 82 60, 70 64, 62 70 Z" fill="url(#hairGirl)" />
          </g>
        )}

        {/* 7. LAYER: GLASSES */}
        {config.glasses === 'vr_visor' && (
          <g>
            <rect x="70" y="74" width="60" height="18" rx="8" fill="url(#cyberGrad)" opacity="0.9" />
            <line x1="75" y1="83" x2="125" y2="83" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 3" />
            <path d="M 62 82 L 70 82 M 130 82 L 138 82" stroke="#06b6d4" strokeWidth="2.5" />
          </g>
        )}

        {config.glasses === 'smart_glasses' && (
          <g stroke="#0d0c22" strokeWidth="2.5" fill="none">
            <circle cx="86" cy="83" r="11" />
            <circle cx="114" cy="83" r="11" />
            <line x1="97" y1="83" x2="103" y2="83" />
            <line x1="64" y1="83" x2="75" y2="83" />
            <line x1="125" y1="83" x2="136" y2="83" />
          </g>
        )}

        {config.glasses === 'sunglasses' && (
          <g fill="#09090b">
            <polygon points="73,76 97,76 94,92 76,92" rx="3" />
            <polygon points="103,76 127,76 124,92 106,92" rx="3" />
            <line x1="96" y1="78" x2="104" y2="78" stroke="#09090b" strokeWidth="3" />
          </g>
        )}

        {/* 8. LAYER: HEADWEAR / TOP ITEMS */}
        {config.headwear === 'crown' && (
          <g className="filter drop-shadow-md">
            <polygon points="76,46 84,24 100,38 116,24 124,46" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="1.5" />
            {/* Jewels */}
            <circle cx="84" cy="28" r="2.5" fill="#ef4444" />
            <circle cx="100" cy="40" r="3" fill="#3b82f6" />
            <circle cx="116" cy="28" r="2.5" fill="#ef4444" />
          </g>
        )}

        {config.headwear === 'grad_cap' && (
          <g className="filter drop-shadow-md">
            {/* Academic Cap Rhombus */}
            <polygon points="100,20 148,34 100,48 52,34" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            {/* Skullcap underneath */}
            <path d="M 75 42 Q 100 52 125 42" fill="#1e293b" />
            {/* Tassel */}
            <circle cx="100" cy="34" r="2.5" fill="#facc15" />
            <path d="M 100 34 Q 130 38 135 56" stroke="#facc15" strokeWidth="2" fill="none" />
            <circle cx="135" cy="57" r="3" fill="#eab308" />
          </g>
        )}

        {config.headwear === 'headphones' && (
          <g>
            {/* Band */}
            <path d="M 60 74 C 60 38, 140 38, 140 74" fill="none" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
            {/* Earcups with neon LED */}
            <rect x="54" y="70" width="10" height="26" rx="5" fill="#ea4c89" />
            <rect x="136" y="70" width="10" height="26" rx="5" fill="#ea4c89" />
          </g>
        )}

        {config.headwear === 'cap' && (
          <g>
            {/* Baseball Cap */}
            <path d="M 64 64 C 64 42, 136 42, 136 64 Z" fill="#2563eb" />
            <ellipse cx="100" cy="62" rx="38" ry="8" fill="#1d4ed8" />
            {/* Visor pointing right */}
            <path d="M 120 63 C 145 64, 155 72, 145 74 C 130 74, 115 67, 120 63 Z" fill="#1e40af" />
          </g>
        )}
      </svg>
    </div>
  );
}

