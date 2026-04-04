import { useState } from 'react';

export default function DeveloperTools({ colorData, colorHex }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const hexColor = `#${colorHex}`;
  const rgbColor = colorData?.rgb;
  const rgbString = `rgb(${rgbColor?.r}, ${rgbColor?.g}, ${rgbColor?.b})`;
  const rgbaString = `rgba(${rgbColor?.r}, ${rgbColor?.g}, ${rgbColor?.b}, 0.8)`;

  const getDarkerShade = () => {
    const r = Math.max(0, Math.round(rgbColor?.r * 0.7));
    const g = Math.max(0, Math.round(rgbColor?.g * 0.7));
    const b = Math.max(0, Math.round(rgbColor?.b * 0.7));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
  };

  const getLighterShade = () => {
    const r = Math.min(255, Math.round(rgbColor?.r + (255 - rgbColor?.r) * 0.3));
    const g = Math.min(255, Math.round(rgbColor?.g + (255 - rgbColor?.g) * 0.3));
    const b = Math.min(255, Math.round(rgbColor?.b + (255 - rgbColor?.b) * 0.3));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
  };

  const darkerColor = getDarkerShade();
  const lighterColor = getLighterShade();

  const languages = {
    React: [
      { label: 'Tailwind', code: `<div className="bg-[${hexColor}]">Content</div>` },
      { label: 'Inline Style', code: `<div style={{ backgroundColor: '${hexColor}' }}>Content</div>` },
    ],
    'React Native': [
      { label: 'StyleSheet', code: `backgroundColor: '${hexColor}'` },
      { label: 'Inline Style', code: `style={{ backgroundColor: '${hexColor}' }}` },
    ],
    iOS: [
      { label: 'SwiftUI', code: `Color(red: ${(rgbColor?.r / 255).toFixed(3)}, green: ${(rgbColor?.g / 255).toFixed(3)}, blue: ${(rgbColor?.b / 255).toFixed(3)})` },
      { label: 'UIColor', code: `UIColor(red: ${(rgbColor?.r / 255).toFixed(3)}, green: ${(rgbColor?.g / 255).toFixed(3)}, blue: ${(rgbColor?.b / 255).toFixed(3)}, alpha: 1)` },
      { label: 'Hex String', code: `UIColor(named: "${hexColor}")` },
    ],
    Android: [
      { label: 'Kotlin', code: `Color.parseColor("${hexColor}")` },
      { label: 'XML', code: `<color name="color">${hexColor}</color>` },
      { label: 'Compose', code: `Color(0xFF${colorHex})` },
    ],
    CSS: [
      { label: 'Variable', code: `--color: ${hexColor};` },
      { label: 'Background', code: `.bg { background-color: ${hexColor}; }` },
      { label: 'Text', code: `.text { color: ${hexColor}; }` },
      { label: 'Border', code: `.border { border: 1px solid ${hexColor}; }` },
    ],
    'Dark Mode': [

      { label: 'CSS', code: `
:root {
  --bg-color: ${hexColor};
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: ${darkerColor};
  }
}

.element {
  background-color: var(--bg-color);
}`.trim()
  }
    ],
  };

  const copyToClipboard = (code, index) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CodeBlock = ({ label, code, index }) => (
    <div className="group">
      <p className="text-xs font-medium text-gray-700 mb-2">{label}</p>
      <div className="relative">
        <pre className="bg-gray-50 border border-gray-200 rounded-sm p-2.5 text-xs overflow-x-auto text-gray-800 font-mono text-left leading-relaxed">
          {code}
        </pre>
        <button
          onClick={() => copyToClipboard(code, index)}
          className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copiedIndex === index ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Color Swatches - Top */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-4"></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Light', color: hexColor },
            { label: 'Dark', color: darkerColor },
            { label: 'Lighter', color: lighterColor },
          ].map((swatch) => (
            <div key={swatch.label} className="space-y-2">
              <p className="text-xs font-medium text-gray-700">{swatch.label}</p>
              <div
                className="h-16 rounded-sm border border-gray-200"
                style={{ backgroundColor: swatch.color }}
              />
              <p className="text-xs text-gray-600 font-mono text-center">{swatch.color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Code Snippets - All Languages in One Grid */}
      <div className="pt-6 border-t border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900 mb-6"> </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {Object.entries(languages).map(([lang, items], langIdx) => (
            <div key={lang} className="bg-white border border-gray-200 rounded-lg p-5">
              <h2 className="text-[10pt] font-semibold text-gray-900  tracking-wide mb-4 pb-3 border-b border-gray-200">
                {lang}
              </h2>
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <CodeBlock
                    key={idx}
                    label={item.label}
                    code={item.code}
                    index={`code-${langIdx}-${idx}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}