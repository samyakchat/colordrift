import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ColorExplorer from './pages/ColorExplorer';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color/:colorHex" element={<ColorExplorer />} />
      </Routes>
    </Router>
  );
}

export default App;