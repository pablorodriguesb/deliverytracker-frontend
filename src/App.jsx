import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapaRastreamento from './pages/MapaRastreamento';
import DeliveryTracker from './pages/DeliveryTracker';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapaRastreamento />} />
        <Route path="/rastreamento" element={<DeliveryTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
