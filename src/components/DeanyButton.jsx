import React from 'react';
import { playClick } from '../utils/clickSound.js';

/**
 * Pressable button with tactile offset-edge press effect.
 * Variants: primary (gold), secondary (outline), ghost.
 */

const C = {
  gold: '#F0B429', goldDk: '#C8901A',
  goldText: '#5A3E00',
  teal: '#22A39A', tealDk: '#1A8C82', tealDeep: '#0F4C5C',
  canvas: '#FBFAF6', surface: '#FFFFFF',
  text: '#173A4A', textMuted: '#5E7480',
  border: 'rgba(15,76,92,0.15)',
};

const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer',
  border: 'none', padding: '12px 24px', minHeight: 48,
  transition: 'transform .08s ease, box-shadow .08s ease, filter .15s ease',
  outline: 'none', position: 'relative', userSelect: 'none',
};

const variants = {
  primary: {
    background: C.gold, color: C.goldText,
    boxShadow: `0 4px 0 ${C.goldDk}`,
  },
  secondary: {
    background: C.surface, color: C.text,
    border: `1.5px solid rgba(15,76,92,0.18)`,
    boxShadow: `0 4px 0 rgba(15,76,92,0.10)`,
  },
  ghost: {
    background: 'transparent', color: C.textMuted,
    boxShadow: 'none',
  },
};

const DeanyButton = ({
  variant = 'primary', children, disabled, style, className = '', onClick, ...rest
}) => {
  const v = variants[variant] || variants.primary;
  const isGhost = variant === 'ghost';

  const handleMouseDown = (e) => {
    if (disabled || isGhost) return;
    playClick();
    e.currentTarget.style.transform = 'translateY(4px)';
    e.currentTarget.style.boxShadow = '0 0 0 transparent';
  };

  const handleMouseUp = (e) => {
    if (disabled || isGhost) return;
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = v.boxShadow;
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    if (isGhost) {
      e.currentTarget.style.color = C.text;
    } else {
      e.currentTarget.style.filter = 'brightness(1.03)';
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.filter = 'none';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = isGhost ? 'none' : v.boxShadow;
    if (isGhost) e.currentTarget.style.color = C.textMuted;
  };

  const disabledStyle = disabled ? {
    opacity: 0.5, cursor: 'not-allowed',
    boxShadow: 'none', filter: 'none',
  } : {};

  const focusClass = 'deany-btn-focus';

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      className={`${focusClass} ${className}`}
      style={{ ...base, ...v, ...disabledStyle, ...style }}
      {...rest}
    >
      {children}
    </button>
  );
};

export default DeanyButton;
