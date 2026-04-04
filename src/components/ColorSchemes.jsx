import { useState } from 'react';

export default function ColorSchemes({ colorData, colorHex }) {
  const [mode, setMode] = useState('light');
  const [role, setRole] = useState('primary');

  if (!colorData) {
    return <p className="text-gray-500">Loading color data...</p>;
  }

  // Helper function to determine if text should be white or black based on background color
  const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000';

  let hex = hexColor.replace('#', '');

  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }

  if (hex.length !== 6) return '#000000';

  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;

  // Apply sRGB transformation
  [r, g, b] = [r, g, b].map(c =>
    c <= 0.03928
      ? c / 12.92
      : Math.pow((c + 0.055) / 1.055, 2.4)
  );

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

  const hexColor = `#${colorHex}`;
  const rgbColor = colorData.rgb;
  
  // Generate complementary color for contrast
  const complementaryHex = colorData.hex?.value === hexColor 
    ? '#' + (0xFFFFFF ^ parseInt(hexColor.slice(1), 16)).toString(16).padStart(6, '0')
    : '#000000';

  // Define color schemes based on role and mode
  const schemes = {
    primary: {
      light: {
        background: '#FFFFFF',
        primary: hexColor,
        secondary: '#F5F5F5',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
      },
      dark: {
        background: '#1a1a1a',
        primary: hexColor,
        secondary: '#2a2a2a',
        text: '#FFFFFF',
        textSecondary: '#CCCCCC',
        border: '#333333',
      },
    },
    secondary: {
      light: {
        background: '#FFFFFF',
        primary: '#000000',
        secondary: hexColor,
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
      },
      dark: {
        background: '#1a1a1a',
        primary: '#FFFFFF',
        secondary: hexColor,
        text: '#FFFFFF',
        textSecondary: '#CCCCCC',
        border: '#333333',
      },
    },
    accent: {
      light: {
        background: '#FFFFFF',
        primary: '#000000',
        secondary: '#F5F5F5',
        accent: hexColor,
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
      },
      dark: {
        background: '#1a1a1a',
        primary: '#FFFFFF',
        secondary: '#2a2a2a',
        accent: hexColor,
        text: '#FFFFFF',
        textSecondary: '#CCCCCC',
        border: '#333333',
      },
    },
  };

  const currentScheme = schemes[role][mode];

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-9">
          
        </h3>

        {/* Controls and Preview Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* LEFT: Controls */}
          <div className="space-y-6">

            {/* Role Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Color Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="accent">Accent</option>
              </select>
            </div>

            {/* Mode Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Theme
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Color Swatches (compact) */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-2">
              {Object.entries(currentScheme).map(([key, color]) => (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-md border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {key}
                    </p>
                    <p className="text-[11px] text-gray-500 font-mono">
                      {color}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT: Preview */}
          <div className="space-y-6 flex flex-col">

            {/* Preview Panel */}
            <div
              className="p-4 border border-gray-200 rounded-md flex-1 flex flex-col"
              style={{ backgroundColor: currentScheme.background }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: currentScheme.primary }}
              >
                Preview
              </h3>
              

              {/* Buttons */}
              <div className="flex gap-2 flex-wrap mb-4">
                <button
                  className="px-4 py-2 text-sm font-medium border rounded-md"
                  style={{
                    backgroundColor: role === 'primary' ? hexColor : currentScheme.primary,
                    color: role === 'primary' ? getContrastColor(hexColor) : currentScheme.text,
                    borderColor: currentScheme.border,
                  }}
                >
                  Primary
                </button>

                <button
                  className="px-4 py-2 text-sm font-medium border rounded-md"
                  style={{
                    backgroundColor: role === 'secondary' ? hexColor : 'transparent',
                    borderColor: role === 'secondary' ? hexColor : currentScheme.border,
                    color: role === 'secondary' ? getContrastColor(hexColor) : currentScheme.text,
                  }}
                >
                  Secondary
                </button>

                {role === 'accent' && (
                  <button
                    className="px-4 py-2 text-sm font-medium rounded-md"
                    style={{
                      backgroundColor: hexColor,
                      color: getContrastColor(hexColor),
                    }}
                  >
                    Accent
                  </button>
                )}
              </div>

              {/* Text */}
              <div className="space-y-1 mb-4">
                <p style={{ color: currentScheme.text }} className="text-sm font-medium">
                  Primary text example
                </p>
                <p style={{ color: currentScheme.textSecondary }} className="text-xs">
                  Secondary text example
                </p>
              </div>

              {/* Card */}
              <div
                className="p-3 border-l-4 rounded-md"
                style={{
                  backgroundColor: currentScheme.secondary,
                  borderColor: role === 'accent' ? hexColor : currentScheme.primary,
                }}
              >
                <p style={{ color: currentScheme.text }} className="text-sm">
                  Accent card preview
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}