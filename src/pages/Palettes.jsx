import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Palettes() {
  const navigate = useNavigate();
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  // Generate random palette as fallback
  const generateRandomPalette = (mode, index) => {
    const randomColor = () => Math.floor(Math.random() * 256);
    const randomPalette = Array(5)
      .fill(0)
      .map(() => [randomColor(), randomColor(), randomColor()]);

    return {
      id: `${mode}-${index}`,
      name: `${mode.charAt(0).toUpperCase() + mode.slice(1)} Palette ${
        index + 1
      }`,
      colors: randomPalette.map((rgb) => {
        const hex = ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2])
          .toString(16)
          .padStart(6, "0")
          .toUpperCase();
        return { rgb, hex };
      }),
      mode,
    };
  };

  useEffect(() => {
    const fetchPalettes = async () => {
      try {
        setLoading(true);

        // Fetch category list
        const listRes = await fetch("/api/list");
        const listData = await listRes.json();

        // Example: ["default","ui","makoto_shinkai",...]
        const fetchedCategories = listData.result || [];

        setCategories(fetchedCategories);

        const allPalettes = [];

        for (let mode of fetchedCategories) {
          for (let i = 0; i < 3; i++) {
            try {
              const response = await fetch("/api/palettes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ model: mode }),
              });

              if (response.ok) {
                const data = await response.json();
                if (data.result) {
                  allPalettes.push({
                    id: `${mode}-${i}`,
                    name: `${formatName(mode)} Palette ${i + 1}`,
                    colors: data.result.map((rgb) => {
                      const hex = ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2])
                        .toString(16)
                        .padStart(6, "0")
                        .toUpperCase();
                      return { rgb, hex };
                    }),
                    mode,
                  });
                  continue;
                }
              }
            } catch (err) {
              console.warn(`Failed for ${mode}, using fallback`);
            }

            // fallback
            allPalettes.push(generateRandomPalette(mode, i));
          }
        }

        setPalettes(allPalettes);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load palettes");
      } finally {
        setLoading(false);
      }
    };

    fetchPalettes();
  }, []);

  const formatName = (mode) => {
    return mode.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const refreshPalettes = () => {
    setLoading(true);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
          <p className="text-gray-500 text-center">Loading palettes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-2">
                Random Palettes
              </h1>
            </div>
            <button
              onClick={refreshPalettes}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400 transition text-sm font-medium"
            >
              Try again :(
            </button>
          </div>
          <p className="text-gray-600 max-w-2xl text-left">
            Explore some generated Palettes in each category. UI and Default are
            constant categories, while the rest may change every day. All of
            these palettes are useful for UI color palettes.
          </p>
        </div>

        {/* Palettes Grid */}
        <div className="space-y-8">
          <div className="space-y-8">
            {/* First: Default + UI */}
            {["default", "ui"].map(
              (category) =>
                categories.includes(category) && (
                  <div key={category}>
                    <h2 className="text-sm font-semibold text-gray-900 tracking-wider mb-4">
                      {category === "ui" ? "UI Design" : "Default"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {palettes
                        .filter((p) => p.mode === category)
                        .map((palette) => (
                          <PaletteCard
                            key={palette.id}
                            palette={palette}
                            navigate={navigate}
                          />
                        ))}
                    </div>
                  </div>
                )
            )}

            {/* Then: dynamic categories */}
            {categories
              .filter((c) => c !== "default" && c !== "ui")
              .map((category) => (
                <div key={category}>
                  <h2 className="text-sm font-semibold text-gray-900 tracking-wider mb-4">
                    {formatName(category)}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {palettes
                      .filter((p) => p.mode === category)
                      .map((palette) => (
                        <PaletteCard
                          key={palette.id}
                          palette={palette}
                          navigate={navigate}
                        />
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PaletteCard({ palette, navigate }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [savedAll, setSavedAll] = useState(false);

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const savePalette = (text, index) => {
    if (!localStorage.getItem("index")) {
      localStorage.setItem("index", 1);
    } else {
      let currentnum = parseInt(localStorage.getItem("index"));
      localStorage.setItem("index", currentnum + 1);
    }

    let currentnum = parseInt(localStorage.getItem("index"));
    localStorage.setItem(currentnum.toString(), text);

    setSavedAll(true);
    setTimeout(() => setSavedAll(false), 2000);
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
        <h3 className="font-semibold text-gray-900 mb-3">{palette.name}</h3>

        <div className="flex gap-3">
          {/* Copy Palette Button */}
          <button
            onClick={() => {
              const allHex = palette.colors.map((c) => `#${c.hex}`).join(", ");
              copyToClipboard(allHex, "all");
              setCopiedAll(true);
              setTimeout(() => setCopiedAll(false), 2000);
            }}
            className="w-full py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-400 rounded transition"
          >
            {copiedAll ? "Copied!" : "Copy Palette"}
          </button>

          {/* Save Palette Button */}
          <button
            onClick={() => {
              const allHex = palette.colors.map((c) => `#${c.hex}`).join(", ");
              savePalette(allHex, "all");
            }}
            className="w-full py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-400 rounded transition"
          >
            {savedAll ? "Saved!" : "Save Palette"}
          </button>
        </div>
      </div>
    </div>
  );
}