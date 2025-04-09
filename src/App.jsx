import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MapaRastreamento from './pages/MapaRastreamento';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapaRastreamento />} />
      </Routes>
    </Router>
  );
}

export default App;
