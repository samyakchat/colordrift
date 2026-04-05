import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Palettes from './pages/Palettes';
import ColorExplorer from './pages/ColorExplorer';
import Footer from './components/footer';
import About from './pages/about';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/color/:colorHex" element={<ColorExplorer />} />
        <Route path="palettes" element={<Palettes />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;