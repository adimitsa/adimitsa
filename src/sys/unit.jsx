import React from 'react';
import './unit.css'; 

export default function Unit(props) {
  const handleChange = (e) => {
    const el = e.target;
    var w = 1+'ch';
    console.log('Textarea with id ' + props.id + ' changed. New value:', el.value);
    const isLastCharSpace = el.value.endsWith(' ');
    if (isLastCharSpace) {
      if (props.wordLimit === '1') {
        e.target.blur(); // Remove focus from the textarea
        return; // Exit the function early to prevent further processing
      }
    }
  if (el.value === undefined || el.value === null || el.value === '') {
    var wp = Math.max(...props.placeholder.split('\n').map(line => line.length))+2; // Add extra space for the longest line
    w = wp+ 'ch'; // Add extra space for placeholder
  } else {
    w = Math.max(...el.value.split('\n').map(line => line.length))+2 + 'ch'; // Add extra space for the longest line
  }
  console.log('Calculated width for textarea with id ' + props.id + ':', w);
    el.style.height = 'auto';
    el.style.width = `${w}`;
    el.style.height = `${el.scrollHeight}px`;
    el.style.width = `${el.scrollWidth}px`;
    
    // Bubble the data smoothly back up to the state Map
    props.onTextChange(props.id, el.value);


  };

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
