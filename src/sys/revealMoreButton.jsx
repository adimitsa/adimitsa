import React from 'react';
import './revealMoreButton.css';

export default function RevealMoreButton(props) {
  return (
    <button className="reveal-more-button" id={props.id} onClick={() => props.handleClickForRevealButton(props.funUnitId)}>+</button>
  );
}
