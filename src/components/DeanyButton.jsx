import React from 'react';

/**
 * Pressable button with tactile offset-edge press effect.
 * Variants: primary (gold), secondary (outline), ghost.
 */

const C = {
  gold: '#C9A961', goldDk: '#8A6F2F',
  forest: '#1B4332', dark: '#0F2E22',
  cream: '#F8F4ED',
  body: '#2A2520', muted: '#6B6356',
  border: 'rgba(201,169,97,0.25)',
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
    background: C.gold, color: '#fff',
    boxShadow: `0 4px 0 ${C.goldDk}`,
  },
  secondary: {
    background: 'transparent', color: C.forest,
    border: `1.5px solid rgba(27,67,50,0.25)`,
    boxShadow: `0 4px 0 rgba(27,67,50,0.12)`,
  },
  ghost: {
    background: 'transparent', color: C.muted,
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
      e.currentTarget.style.color = C.forest;
    } else {
      e.currentTarget.style.filter = 'brightness(1.03)';
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.filter = 'none';
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = isGhost ? 'none' : v.boxShadow;
    if (isGhost) e.currentTarget.style.color = C.muted;
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
