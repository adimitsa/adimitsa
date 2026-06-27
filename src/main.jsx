import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import Ago from './ago/ago.jsx';
import Sys from './sys/sys.jsx'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/mitsa-beauty">AGO</Link> {" "}
        <Link to="/sys">SYS</Link>
      </nav>

      <Routes>
        <Route path="/mitsa-beauty" element={<Ago />} />
        <Route path="/sys" element={<Sys />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <App />
);