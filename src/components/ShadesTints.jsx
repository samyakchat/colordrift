import { useState } from 'react';

export default function ShadesTints({ colorHex }) {
  const [count] = useState(10);

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to hex
  const rgbToHex = (r, g, b) => {
    return ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase();
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Generate shades (darker) and tints (lighter)
  const generateVariations = () => {
    const rgb = hexToRgb(colorHex);
    if (!rgb) return { shades: [], tints: [] };

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const variations = [];

    // Generate shades (decrease lightness)
    for (let i = 1; i < count; i++) {
      const newL = (hsl.l * (count - i)) / count;
      const newRgb = hslToRgb(hsl.h, hsl.s, newL);
      variations.push({
        hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
        type: 'shade',
        label: `${Math.round((1 - i / count) * 100)}%`,
      });
    }

    // Add the original color in the middle
    variations.push({
      hex: colorHex,
      type: 'original',
      label: 'Original',
    });

    // Generate tints (increase lightness)
    for (let i = 1; i < count; i++) {
      const newL = hsl.l + ((100 - hsl.l) * i) / count;
      const newRgb = hslToRgb(hsl.h, hsl.s, newL);
      variations.push({
        hex: rgbToHex(newRgb.r, newRgb.g, newRgb.b),
        type: 'tint',
        label: `${Math.round(i * (100 / count))}%`,
      });
    }

    return variations;
  };

  const variations = generateVariations();
  const shades = variations.filter(v => v.type === 'shade').reverse();
  const original = variations.find(v => v.type === 'original');
  const tints = variations.filter(v => v.type === 'tint');

  return (
    <div className="space-y-5">
      {/* Shades Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4 mt-4">Shades</h3>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-2 min-w-max">
            {shades.map((variation, idx) => (
              <div key={idx} className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-md border border-gray-300  cursor-pointer hover:shadow-md transition"
                  style={{
                    backgroundColor: `#${variation.hex}`,
                  }}
                  title={`#${variation.hex}`}
                />
                <p className="text-xs font-mono text-gray-600 mt-2 text-center">
                  {variation.hex}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  {variation.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Tints Section */}
      <div>
        <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-4">Tints</h3>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-2 min-w-max">
            {tints.map((variation, idx) => (
              <div key={idx} className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-md border border-gray-300  cursor-pointer hover:shadow-md transition"
                  style={{
                    backgroundColor: `#${variation.hex}`,
                  }}
                  title={`#${variation.hex}`}
                />
                <p className="text-xs font-mono text-gray-600 mt-2 text-center">
                  {variation.hex}
                </p>
                <p className="text-xs text-gray-400 text-center">
                  {variation.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}