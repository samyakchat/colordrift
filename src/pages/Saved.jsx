import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Saved() {
  const navigate = useNavigate();
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedPalettes = () => {
      try {
        setLoading(true);
        const savedPalettes = [];

        // Get the index to know how many palettes were saved
        const index = parseInt(localStorage.getItem("index")) || 0;

        // Retrieve all saved palettes from localStorage
        for (let i = 1; i <= index; i++) {
          const paletteData = localStorage.getItem(i.toString());
          if (paletteData) {
            // Parse the palette string (e.g., "#FF5733, #33FF57, #3357FF")
            const hexColors = paletteData
              .split(",")
              .map((hex) => hex.trim())
              .filter((hex) => hex.match(/^#[0-9A-F]{6}$/i));

            if (hexColors.length > 0) {
              savedPalettes.push({
                id: `saved-${i}`,
                name: `Saved Palette ${i}`,
                colors: hexColors.map((hex) => ({
                  hex: hex.replace("#", ""),
                  rgb: hexToRgb(hex),
                })),
                storageIndex: i,
              });
            }
          }
        }

        setPalettes(savedPalettes);
      } catch (err) {
        console.error("Failed to load saved palettes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadSavedPalettes();
  }, []);

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };

  const deletePalette = (storageIndex) => {
    // Remove from localStorage
    localStorage.removeItem(storageIndex.toString());

    // Update state
    setPalettes(palettes.filter((p) => p.storageIndex !== storageIndex));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <p className="text-gray-500 text-center">Loading saved palettes...</p>
        </div>
      </div>
    );
  }

  if (palettes.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-4">
            Saved Palettes
          </h1>
          <p className="text-gray-600">
            You haven't saved any palettes yet. If you find one that sticks out
            to you, save it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-2">
              Saved Palettes
            </h1>
            <p className="text-gray-600">
              Your collection of saved color palettes. Click on colors to
              explore them individually, copy hex codes, or delete palettes you
              no longer need.
            </p>
          </div>
        </div>

        {/* Palettes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {palettes.map((palette) => (
            <SavedPaletteCard
              key={palette.id}
              palette={palette}
              navigate={navigate}
              onDelete={deletePalette}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SavedPaletteCard({ palette, navigate, onDelete }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden">
      {/* Color Swatches */}
      <div className="flex h-24">
        {palette.colors.map((color, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/color/${color.hex}`)}
            className="flex-1 hover:opacity-90 transition cursor-pointer group relative"
            style={{ backgroundColor: `#${color.hex}` }}
            title={`#${color.hex}`}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20">
              <span className="text-white text-xs font-mono mb-2">#{color.hex}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(`#${color.hex}`, idx);
                }}
                className="text-xs px-2 py-1 bg-white/30 hover:bg-white/50 text-white rounded transition"
              >
                {copiedIndex === idx ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Palette Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Saved Palette</h3>

        <div className="flex gap-3">
          {/* Copy Palette Button */}
          <button
            onClick={() => {
              const allHex = palette.colors.map((c) => `#${c.hex}`).join(", ");
              copyToClipboard(allHex, "all");
            }}
            className="flex-1 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-400 rounded transition"
          >
            Copy Palette
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(palette.storageIndex)}
            className="flex-1 py-2 text-sm font-medium text-white bg-[#f7484b] hover:bg-red-300 rounded transition"
          >
            Delete
          </button>
        </div>
        <div className="mt-3">
        <button
            onClick={() => navigate(`/examplepage/${palette.storageIndex}`)}
            className="w-full py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-400 rounded transition"
          >
            Open web preview
          </button>
      </div>
      </div>
    </div>
  );
}