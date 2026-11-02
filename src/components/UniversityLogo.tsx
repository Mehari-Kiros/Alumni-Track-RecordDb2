/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  lightMode?: boolean;
  standaloneImage?: boolean;
}

export const UniversityLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  lightMode = false,
  standaloneImage = false
}) => {
  const pixelSizes = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 92,
    '2xl': 120
  };

  const dim = pixelSizes[size] || 48;
  const logoSrc = '/assets/aistudio/EDU-Logo_d97f89a7.png';

  const imageElement = (
    <div
      className="shrink-0 flex items-center justify-center overflow-hidden rounded-full aspect-square bg-white shadow-lg border-2 border-amber-400 ring-2 ring-amber-500/30 p-1 transition-transform duration-300 hover:scale-105"
      style={{ width: dim, height: dim, minWidth: dim, minHeight: dim }}
    >
      <img
        src={logoSrc}
        alt="Ethiopian Defence University Official Logo"
        className="w-full h-full object-contain rounded-full"
        loading="eager"
      />
    </div>
  );

  if (standaloneImage) {
    return imageElement;
  }

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {imageElement}

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-serif tracking-wide font-bold text-xs sm:text-sm leading-tight ${
              lightMode ? 'text-slate-900' : 'text-amber-400'
            }`}
          >
            የኢትዮጵያ መከላከያ ዩኒቨርሲቲ
          </span>
          <span
            className={`font-serif tracking-wider font-bold text-xs sm:text-sm leading-tight mt-0.5 ${
              lightMode ? 'text-slate-900' : 'text-amber-400'
            }`}
          >
            ETHIOPIAN DEFENCE UNIVERSITY
          </span>
          <span
            className={`text-[9px] sm:text-[11px] tracking-tight mt-0.5 ${
              lightMode ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            Alumni Track Record Database (EDU-ATRD)
          </span>
        </div>
      )}
    </div>
  );
};
