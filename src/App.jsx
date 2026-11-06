import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Palettes from './pages/Palettes';
import ColorExplorer from './pages/ColorExplorer';
import Footer from './components/footer';
import About from './pages/about';
import { Analytics } from '@vercel/analytics/react';
import Saved from './pages/Saved';
import Example from './pages/TempExamp';
import Colordle from './pages/Colordle';
import { isColordleHost } from './lib/colordle';

function SiteRoutes() {
  const { pathname } = useLocation();
  if (isColordleHost(window.location.hostname) || pathname === '/colordle' || pathname === '/colordle/') {
    return <Colordle />;
  }
  return (
    <>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/color/:colorHex" element={<ColorExplorer />} />
        <Route path="palettes" element={<Palettes />} />
        <Route path="/about" element={<About />} />
        <Route path="/saved" element={<Saved />} />
        <Route path='/examplepage/:paramId' element={<Example />} />

      </Routes>
      <Footer />
    </>
    
  );
}

function App() {
  return <Router><SiteRoutes /><Analytics /></Router>;
}

export default App;
