import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [colorInput, setColorInput] = useState("");
  const navigate = useNavigate();

  const rgbToHex = (r, g, b) => {
    return ((r << 16) | (g << 8) | b)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
  };

  const parseColorInput = (input) => {
    const trimmed = input.trim();

    // Check if it's RGB format: rgb(r, g, b)
    const rgbMatch = trimmed.match(
      /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i
    );
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1]);
      const g = parseInt(rgbMatch[2]);
      const b = parseInt(rgbMatch[3]);

      // Validate RGB values
      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return rgbToHex(r, g, b);
      }
    }

    // Check if it's just comma-separated RGB: r,g,b
    const csvMatch = trimmed.match(/^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/);
    if (csvMatch) {
      const r = parseInt(csvMatch[1]);
      const g = parseInt(csvMatch[2]);
      const b = parseInt(csvMatch[3]);

      if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return rgbToHex(r, g, b);
      }
    }

    // Otherwise assume it's hex
    return trimmed.replace("#", "").toUpperCase();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (colorInput.trim()) {
      const hex = parseColorInput(colorInput);
      navigate(`/color/${hex}`);
      setColorInput("");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9">
              <img
                src="/logo.png"
                alt="Color Drift Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[24px] font-semibold tracking-tight text-gray-900 hover:text-gray-300 transition">
              colordrift
            </span>
          </Link>

          {/* Center Search (desktop) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-full max-w-2xl"
          >
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden focus-within:border-[#73aa28] transition">
              <input
                type="text"
                placeholder="Hex (78aa28) or RGB (120, 170, 40)"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                className="w-full px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-4 border-l border-gray-300 text-sm font-medium text-gray-700 hover:bg-[#73aa28] hover:border-[#73aa28] transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="flex items-center gap-5">
            <Link to="/" className="text-sm text-gray-700 hover:text-[#73aa28]">
              Home
            </Link>

            <a
              href="/palettes"
              className="text-sm text-gray-700 hover:text-[#73aa28]"
            >
              Palettes
            </a>

            <a
              href="/saved"
              className="text-sm text-gray-700 hover:text-[#78aa28]"
            >
              Saved
            </a>

            <a
              href="/about"
              className="text-sm text-gray-700 hover:text-[#78aa28]"
            >
              About
            </a>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="md:hidden py-3 flex gap-2">
          <input
            type="text"
            placeholder="Hex or RGB"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Go
          </button>
        </form>
      </div>
    </nav>
  );
}
