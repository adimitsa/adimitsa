import React from 'react';
import './svgLine.css';

export default function SvgLine({ point1, point2 }) {
  const [x1, y1] = point1;
  const [x2, y2] = point2;

  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;

  return (
    <svg className="svg-line-container">      
      <line
        className="svg-line"
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
      />

      <text 
        className="svg-line-text"
        x={centerX} 
        y={centerY} 
      >
        Outcome is organized as
      </text>
    </svg>
  );
}
