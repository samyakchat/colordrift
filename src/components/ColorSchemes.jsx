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
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex gap-4 flex-wrap">
        {/* Role Selector */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Color Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="accent">Accent</option>
          </select>
        </div>

        {/* Mode Selector */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">
            Theme
          </label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(currentScheme).map(([key, color]) => (
          <div key={key} className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
              style={{ backgroundColor: color }}
              title={color}
            />
            <div className="flex-1">
              <p className="text-sm font-semibold capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <p className="text-xs font-mono text-gray-500">{color}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 rounded-lg border-2 border-gray-200" style={{ backgroundColor: currentScheme.background }}>
        <h3 className="text-lg font-bold mb-4" style={{ color: currentScheme.primary }}>
          Component Preview
        </h3>

        {/* Button Preview - Shows your color in action */}
        <div className="mb-4 flex gap-2 flex-wrap">
          <button
            className="px-4 py-2 rounded-lg font-medium transition hover:opacity-90"
            style={{
              backgroundColor: role === 'primary' ? hexColor : currentScheme.primary,
              color: role === 'primary' ? getContrastColor(hexColor) : currentScheme.text,
            }}
          >
            {role === 'primary' ? 'Your Color' : 'Primary Button'}
          </button>

          <button
            className="px-4 py-2 rounded-lg font-medium transition border-2 hover:opacity-90"
            style={{
              borderColor: role === 'secondary' ? hexColor : currentScheme.secondary,
              color: role === 'secondary' ? getContrastColor(hexColor) : currentScheme.text,
              backgroundColor: role === 'secondary' ? hexColor : 'transparent',
            }}
          >
            {role === 'secondary' ? 'Your Color' : 'Secondary Button'}
          </button>

          {role === 'accent' && (
            <button
              className="px-4 py-2 rounded-lg font-medium transition"
              style={{
                backgroundColor: hexColor,
                color: getContrastColor(hexColor),
              }}
            >
              Accent Button
            </button>
          )}
        </div>

        {/* Text Preview */}
        <div className="space-y-2 mb-4">
          <p style={{ color: currentScheme.text }} className="font-semibold">
            Primary Text - This is the main content
          </p>
          <p style={{ color: currentScheme.textSecondary }} className="text-sm">
            Secondary text with reduced emphasis
          </p>
        </div>

        {/* Card Preview with color accent */}
        <div
          className="mt-4 p-4 rounded-lg border-l-4"
          style={{
            backgroundColor: currentScheme.secondary,
            borderColor: role === 'accent' ? hexColor : currentScheme.primary,
            borderLeftWidth: '4px',
          }}
        >
          <p style={{ color: currentScheme.text }} className="text-sm font-medium">
            Card with {role === 'accent' ? 'accent' : role} color accent
          </p>
          <p style={{ color: currentScheme.textSecondary }} className="text-xs mt-1">
            The colored left border demonstrates your color in context
          </p>
        </div>

        {/* Badge/Tag with your color */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: hexColor,
              color: getContrastColor(hexColor),
            }}
          >
            Badge with your color
          </span>
          <span
            className="px-3 py-1 rounded-full text-sm font-medium border-2"
            style={{
              borderColor: hexColor,
              color: hexColor,
              backgroundColor: 'transparent',
            }}
          >
            Outlined badge
          </span>
        </div>
      </div>

      {/* Color Values */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-sm mb-3">Color Values</h4>
        <div className="space-y-2 text-sm">
          <p>
            <strong>HEX:</strong>{' '}
            <code className="bg-white px-2 py-1 rounded text-xs font-mono">
              {hexColor}
            </code>
          </p>
          <p>
            <strong>RGB:</strong>{' '}
            <code className="bg-white px-2 py-1 rounded text-xs font-mono">
              rgb({rgbColor?.r}, {rgbColor?.g}, {rgbColor?.b})
            </code>
          </p>
          <p>
            <strong>CSS Variable:</strong>{' '}
            <code className="bg-white px-2 py-1 rounded text-xs font-mono">
              --color-{role}: {hexColor};
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}