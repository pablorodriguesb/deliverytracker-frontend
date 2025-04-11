import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapaRastreamento from './components/MapaRastreamento';
import DeliveryTracker from './pages/DeliveryTracker';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MapaRastreamento />} />
          <Route path="/rastreamento" element={<DeliveryTracker />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
