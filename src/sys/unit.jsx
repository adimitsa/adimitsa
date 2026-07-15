import React from 'react';
import './unit.css'; 

export default function Unit(props) {
  const handleChange = (e) => {
    const el = e.target;
    
    el.style.height = 'auto';
    el.style.width = `${props.placeholder.length + 2}ch`;
    el.style.height = `${el.scrollHeight}px`;
    el.style.width = `${el.scrollWidth}px`;
    
    // Bubble the data smoothly back up to the state Map
    props.onTextChange(props.id, el.value);
  };
  var w = Math.max(props.placeholder.length, props.value.length)+'ch';
  return (
    <textarea
      className="textarea"
      id={props.id}
      value={props.value}
      w={w}
      onChange={handleChange}
      placeholder={props.placeholder}
    />
  );
}
