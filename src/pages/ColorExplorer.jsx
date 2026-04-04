import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ColorPreview from '../components/ColorPreview';
import ColorConversions from '../components/ColorConversions';
import ShadesTints from '../components/ShadesTints';
import ColorSchemes from '../components/ColorSchemes';
import PaletteGroups from '../components/PaletteGroups';
import DeveloperTools from '../components/DeveloperTools';

export default function ColorExplorer() {
  const { colorHex } = useParams();
  const [colorData, setColorData] = useState(null);
  const [palettes, setPalettes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.thecolorapi.com/id?hex=${colorHex}`
        );
        const data = await response.json();

        console.log("Color API Response:", data);
        setColorData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    const fetchPalettes = async () => {
      try {
        const modes = ['analogic', 'complement', 'monochrome', 'monochrome-dark', 'monochrome-light'];
        const palettesData = {};

        for (const mode of modes) {
          try {
            const response = await fetch(
              `https://www.thecolorapi.com/scheme?hex=${colorHex}&mode=${mode}&count=5`
            );
            
            if (!response.ok) {
              console.warn(`Failed to fetch ${mode} palette`);
              palettesData[mode] = [];
              continue;
            }
            
            const data = await response.json();
            palettesData[mode] = data.colors || [];
          } catch (modeErr) {
            console.warn(`Error fetching ${mode}:`, modeErr);
            palettesData[mode] = [];
          }
        }
        
        setPalettes(palettesData);
      } catch (err) {
        console.error('Failed to fetch palettes:', err);
        setPalettes({});
      }
    };

    fetchColor();
    fetchPalettes();
  }, [colorHex]);

  if (loading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-sm">Error: {error}</p>
      </div>
    );
  if (!colorData)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm">No color data found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Color Explorer</p>
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-2">#{colorHex}</h1>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT PANEL - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Color Preview Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
              <h2 className="text-sm font-semibold text-gray-900 mb-6">Preview</h2>
              <ColorPreview colorData={colorData} colorHex={colorHex} />
            </div>



            {/* Shades & Tints Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
              <h2 className="text-sm font-semibold text-gray-900 mb-6">Shades & Tints</h2>
              <ShadesTints colorHex={colorHex} />
            </div>

            
            
          </div>
          

          {/* RIGHT PANEL - 1 column */}
          <div className="lg:col-span-1 flex items-start ">
            <div className=" top-8 bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
              <h2 className="text-sm font-semibold text-gray-900 mb-6">Variations</h2>
              {palettes && Object.keys(palettes).length > 0 ? (
                <PaletteGroups palettes={palettes} />
              ) : (
                <p className="text-sm text-gray-400">Loading variations...</p>
              )}
            </div>
          </div>
        </div>
{/* Color Schemes Card - FULL WIDTH */}
            <div className="mt-12 bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h2 className="text-sm font-semibold text-gray-900 mb-9">See it in action</h2>
            <ColorSchemes colorData={colorData} colorHex={colorHex} />
            </div>
        {/* Developer Tools Section */}
        <div className="mt-12 bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
          <h2 className="text-sm font-semibold text-gray-900 mb-6">Developer</h2>
          <DeveloperTools colorData={colorData} colorHex={colorHex} />
        </div>
      </div>
    </div>
  );
}