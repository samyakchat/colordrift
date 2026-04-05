import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = () => {
    if (searchInput.trim()) {
      let hexColor = searchInput.trim().toUpperCase();
      if (!hexColor.startsWith('#')) {
        hexColor = '#' + hexColor;
      }
      navigate(`/color/${hexColor.replace('#', '')}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

const featuredColors = [
  { hex: '73aa28', light: 'EEF6E5', name: 'Fresh Green' },
  { hex: 'ff6b6b', light: 'FFECEC', name: 'Coral Red' },
  { hex: '4ecdc4', light: 'EAF9F8', name: 'Teal' },
  { hex: 'ffe66d', light: 'FFFBEA', name: 'Sunshine' },
  { hex: 'a29bfe', light: 'F1EFFF', name: 'Lavender' },
  { hex: 'fd79a8', light: 'FFEFF5', name: 'Pink' },
];

  return (
    <div className="bg-white min-h-screen">
 
      <div className="max-w-6xl mx-auto px-6 py-10 lg:py-8">
        <div className="mb-5 text-center">
       
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight">
            <span className="block text-gray-600">Colors for</span>
            <span className="inline-block bg-gradient-to-r from-[#73aa28] via-[#679924] to-[#73aa28] bg-clip-text text-transparent">
              developers & designers
            </span>
          </h1>

        <div className='max-w-3xl mx-auto text-center mb-8'>
         <p className="text-lg text-gray-600 mb-8  mx-auto text-center leading-relaxed">
            An essential tool, and the only one you'll need, to find colors. Search any color, explore variations, preview frontend components, and copy code for platforms.
          </p>
        </div>
         

   
          <div className="flex gap-3 max-w-xl mx-auto mb-12">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter HEX, or RGB (like #78AA23) "
              className="flex-1 px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#73aa28] text-white rounded-lg hover:bg-[#92d13d] transition font-medium"
            >
              Search
            </button>
          </div>

          <div className="space-y-5">
            <p className="text-sm font-medium text-gray-700 mb-5 tracking-wider">Try some colors I like</p>
            <div className="flex flex-wrap mt-3 justify-center gap-3">
              {featuredColors.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => navigate(`/color/${color.hex}`)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-md hover:ring-1 ring-inset ring-black transition `}
                  style={{ backgroundColor: `#${color.light}` }}
                >
                  <div
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: `#${color.hex}` }}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">#{color.hex}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        

     
        <div className="mt-24 pt-16 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                For Designers
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Study color variations, complementary colors, and schemes. See how colors look in real UI previews.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                For Developers
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Copy readily made code for React, React Native, iOS, Android, and CSS. More languages should be supported soon.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Always Accurate
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Powered by The Color API, you can see exact conversions, complementary colors, and color schemes in real time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}