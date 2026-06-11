/**
 * IlovemitsaPage
 *
 * Page entry point — composes components only.
 * All logic lives in hooks/, all styles in styles/, all UI in components/.
 */
import './styles/ilovemitsa.css'
import InfiniteCanvas from './components/canvas/InfiniteCanvas'

export default function IlovemitsaPage() {
  return (
    <div className="w-screen h-screen">
      <InfiniteCanvas />
    </div>
  )
}
