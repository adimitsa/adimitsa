import React, { useState } from 'react';
import Unit from './unit';
import FunUnit from './funUnit';
import './process.css';

export default function Process(props) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div 
      className={`process draggable ${isDragging ? 'dragging' : ''}`}
      // 1. Pass coordinates cleanly into custom CSS variables
      style={{ 
        '--x': `${position.x}px`, 
        '--y': `${position.y}px` 
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Unit id={props.unit.id} value={props.unit.value} onTextChange={props.onTextChange} placeholder={props.unit.placeholder}/>
      <div className="fun-units-row">
        <FunUnit unit1={props.fu1unit1} unit2={props.fu1unit2} onTextChange={props.onTextChange}/>
        <FunUnit unit1={props.fu2unit1} unit2={props.fu2unit2} onTextChange={props.onTextChange}/>
      </div>
    </div>
  );
}
