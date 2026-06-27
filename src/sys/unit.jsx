import React from 'react';
import './unit.css'; 

export default function Unit(props) {
  const handleChange = (e) => {
    const el = e.target;
    
    el.style.height = 'auto';
    el.style.width = 'auto';
    el.style.height = `${el.scrollHeight}px`;
    el.style.width = `${el.scrollWidth}px`;
    
    // Bubble the data smoothly back up to the state Map
    props.onTextChange(props.id, el.value);
  };
    console.log('unit:', props); 
  return (
    <textarea
      className="textarea"
      id={props.id}
      value={props.value}
      onChange={handleChange}
      placeholder={props.placeholder}
    />
  );
}
