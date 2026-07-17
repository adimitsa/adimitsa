import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Ago from './ago/ago.jsx';
import Sys from './sys/sys.jsx'

import agoImage from './ago/ago1.png'; // 1. Import at the top
import sysImage from './sys/sys1.png'; // 1. Import at the top

function App() {
  const containerStyle = {
    width: '100%',
    height: '100vh',    
    overflow: 'hidden', 
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column', // Automatically stacks child elements top-to-bottom
  };

  return (
    <BrowserRouter>
      {/* Aggressive CSS reset to strip hidden browser padding from tags */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden; 
        }
      `}</style>

      <div style={containerStyle}>
        
        {/* 1. TOP LAYER (Main Content - No absolute styles, perfectly fills 95%) */}
        <div style={{ 
          height: '95%', 
          border: '1px solid lightcoral', 
          overflow: 'hidden' 
        }}>
          <Routes>
            <Route path="/mitsa-beauty" element={<Ago />} />
            <Route path="/sys" element={<Sys />} />
          </Routes>
        </div>

        {/* 2. MIDDLE LAYER (Navigation - Automatically snaps right under top layer) */}
        <div style={{ 
          height: '4%', 
          border: '1px solid lightblue' 
        }}>
          <nav>
            <Link to="/mitsa-beauty">
<img src={agoImage} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </Link>
            {" | "}
            <Link to="/sys">
      <img src={sysImage} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            </Link>
          </nav>
        </div>
        
        {/* 3. BOTTOM LAYER (Footer - Automatically snaps right under middle layer) */}
        <div style={{ 
          height: '3%', 
          border: '1px solid lightgreen' 
        }}>
          {<I />}
        </div>

      </div>
    </BrowserRouter>
  );
}

function I() {
  return (
    <>
    <textarea id="textArea" placeholder="What's happening?" />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <App />  
);