/**
 * AppRouter
 *
 * All routes live here. One route per page.
 * To add a page: import it, add a <Route>.
 *
 * Route map:
 *   /            → /ilovemitsa  (default)
 *   /ilovemitsa  → IlovemitsaPage
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import IlovemitsaPage from '@/pages/ilovemitsa/IlovemitsaPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ilovemitsa" replace />} />
        <Route path="/ilovemitsa" element={<IlovemitsaPage />} />
        <Route path="*" element={<Navigate to="/ilovemitsa" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
