import { useNavigate } from "react-router-dom";
export default function PaletteGroups({ palettes }) {
  if (!palettes || Object.keys(palettes).length === 0) {
    return <p className="text-gray-500">Loading palettes...</p>;
  }

  const groupNames = {
    triad: 'Triadic',
    analogic: 'Analogic',
    'analogic-complement': 'Analogic Complementary',
    complement: 'Complementary',
    monochrome: 'Monochromatic',
    'monochrome-dark': 'Monochromatic (Dark)',
    'monochrome-light': 'Monochromatic (Light)',
    quad: 'Quadricolor'
  };
  const navigate = useNavigate();
  return (//navigate(`/color/${hex}`);
    <div className="space-y-6">
      {Object.entries(palettes).map(([mode, colors]) => (
        <div key={mode}>
          <h3 className="text-md font-semibold mb-2">{groupNames[mode]}</h3>
          
          {/* Horizontal scroll palette group */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {colors.map((color, idx) => (
              <div key={idx} className="flex-shrink-0">
                <button
                  onClick={() => navigate(`/color/${color.hex?.value.replace('#', '')}`)}
                >
                  <div
                    className="w-15 h-15 rounded-sm cursor-pointer hover:shadow-md transition"
                    style={{ backgroundColor: color.hex?.value || `#${color}` }}
                    title={color.hex?.value}
                  />
                  <p className="text-xs font-mono mt-1 text-center text-gray-600">
                    {(color.hex?.value || color).slice(1)}
                  </p>
                </button>
                
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}