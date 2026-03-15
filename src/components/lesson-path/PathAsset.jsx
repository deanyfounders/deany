import React from 'react';

/**
 * Wrapper for decorative 3D objects along the lesson path.
 * Applies consistent perspective tilt and keeps objects non-interactive.
 */
const PathAsset = ({ children }) => (
  <div style={{
    pointerEvents: 'none',
    transform: 'perspective(600px) rotateX(10deg)',
    transformOrigin: 'center bottom',
  }}>
    {children}
  </div>
);

export default PathAsset;
