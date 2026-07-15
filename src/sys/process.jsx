import React, { useState } from 'react';
import Unit from './unit';
import FunUnit from './funUnit';
import './process.css';

export default function Process(props) {
  return (
    <div 
      className='process'
      id={props.id}
      onClick={props.handleContainerClick}
    >
        <FunUnit id={props.fu1Id} unit1={props.fu1unit1} unit2={props.fu1unit2} unit3={props.fu1unit3} onTextChange={props.onTextChange} handleClickForRevealButton={props.handleClickForRevealButton} buttonConfig={props.fu1buttonConfig}/>
        <Unit id={props.unit.id} value={props.unit.value} onTextChange={props.onTextChange} placeholder={props.unit.placeholder} />
        <FunUnit id={props.fu2Id} unit1={props.fu2unit1} unit2={props.fu2unit2} unit3={props.fu2unit3} onTextChange={props.onTextChange} handleClickForRevealButton={props.handleClickForRevealButton} buttonConfig={props.fu2buttonConfig}/>
    </div>
  );
}
