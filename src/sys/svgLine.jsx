import React from 'react';
import './svgLine.css';

export default function SvgLine({ point1, point2 }) {
  // Destructure coordinates out of the two arrays
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  return (
    <svg 
     style={{
        position: 'absolute', // Locks canvas directly to the relative container layout
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        margin: 0,
        padding: 0,
        zIndex: 9999
      }}
    >      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="black"
        strokeWidth="2"
      />
    </svg>
  );
}
