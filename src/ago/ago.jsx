import React from 'react';
import { useEffect } from 'react';

import './ago-container.css';
import './auto-resize-textarea.css';
import './obj-wrapper.css';
import './obj-wrapper-btns.css';
import './obj-seperator.css';
import './principles-processes.css';
import agoImage from './ago.png';

function Ago() {
    useEffect(() => {
    // 1. React has rendered the DOM.
    // 2. We now dynamically load and run your script.
    import('./ago.js')
      .then(() => {
        console.log("ago.js loaded and executed successfully after DOM render.");
      })
      .catch((err) => {
        console.error("Failed to load ago.js", err);
      });
  }, []); // The empty array ensures this only happens once, right after initial render.

  const backgroundStyle = {
    background: `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)), url(${agoImage})`,    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    opacity: 0.1,
    pointerEvents: 'none' // Prevents the overlay from blocking clicks to elements underneath
  };

  return (
    <>
      <div style={backgroundStyle}></div>
      
      <div id="ago-container"></div>
      
      <div id="principles-processes">
        <p><strong>Principles</strong></p>
        <p>A. If you know exactly what your objectives are, it is easier to achieve them.</p>
        <p>B. Objectives should be clear enough, real enough and possible enough for you to try and reach them.</p>
        
        <p><strong>Processes</strong></p>
        <p>A. How important are other people's objectives?</p>
      </div>
    </>
  );
};

export default Ago;