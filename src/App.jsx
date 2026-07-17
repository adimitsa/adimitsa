import { Routes, Route } from "react-router-dom";

import Homepage from "./homepage/components/Homepage";
import Sys from "./sys/sys";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/sys" element={<Sys />} />
    </Routes>
  );
}