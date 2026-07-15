import React from 'react';
import Unit from './unit';
import RevealMoreButton from './revealMoreButton';
import './funUnit.css';

export default function FunUnit(props) {
  return (
    <div className="funUnit" id={props.id}>
      <Unit id={props.unit1.id} value={props.unit1.value} onTextChange={props.onTextChange} placeholder={props.unit1.placeholder} />
      <Unit id={props.unit2.id} value={props.unit2.value} onTextChange={props.onTextChange} placeholder={props.unit2.placeholder} />
      <Unit id={props.unit3.id} value={props.unit3.value} onTextChange={props.onTextChange} placeholder={props.unit3.placeholder} />
      {props.buttonConfig.visible &&
      <RevealMoreButton id={props.buttonConfig.id} handleClickForRevealButton={props.handleClickForRevealButton} funUnitId={props.id} />
      }
      </div>
  );
}

