import React from 'react';
import Unit from './unit';
import './funUnit.css';

export default function FunUnit(props) {
  console.log('fununit:', props); 
  return (
    <div className="funUnit">
      <Unit id={props.unit1.id} value={props.unit1.value} onTextChange={props.onTextChange} placeholder={props.unit1.placeholder} />
      <Unit id={props.unit2.id} value={props.unit2.value} onTextChange={props.onTextChange} placeholder={props.unit2.placeholder} />
    </div>
  );
}

