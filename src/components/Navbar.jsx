import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { menuOutline } from 'ionicons/icons';

import { addIcons } from "ionicons";
import { getColordleUrl } from '../lib/colordle';
import { resolveColorSearch } from '../lib/colorSearch.js';
export default function Navbar() {
    addIcons({ menuOutline });

  const [colorInput, setColorInput] = useState("");
  const [open, setOpen] = useState(false);
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const hex = resolveColorSearch(colorInput);
    if (!hex) {
      setSearchError('Enter a Color API name, HEX, or RGB values (0–255).');
      return;
    }
    setSearchError("");
    navigate(`/color/${hex}`);
    setColorInput("");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 relative">
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
            className="hidden xl:flex absolute left-1/2 transform -translate-x-1/2 w-full max-w-sm"
          >
            <div className="flex w-full border border-gray-300 rounded-md overflow-hidden focus-within:border-[#73aa28] transition">
              <input
                type="text"
                placeholder="Color name, HEX, or RGB"
                value={colorInput}
                onChange={(e) => { setColorInput(e.target.value); setSearchError(""); }}
                aria-label="Search by color name, HEX, or RGB"
                aria-invalid={Boolean(searchError)}
                aria-describedby={searchError ? "navbar-search-error" : undefined}
                className="w-full px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="px-4 border-l border-gray-300 text-sm bg-white font-medium text-gray-700 hover:bg-[#73aa28] hover:border-[#73aa28] transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Links */}
          <div className="flex items-center gap-5 hidden md:flex">
            <a href={getColordleUrl()} className="text-sm text-gray-700 hover:text-[#73aa28]">
              Colordle
            </a>
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

              {/* Mobile menu button */}   
            <div className="md:hidden">
                <button
                    onClick={() => setOpen(!open)}  
                    className="p-2 rounded-md mt-1 text-gray-700 hover:text-[#73aa28]  "
                >
                   <ion-icon name="menu" size="large"></ion-icon>
                </button>
            </div>

            {open && (
                <div className="absolute top-14 left-0 right-0 bg-white border-b-2 border-gray-200 md:hidden  rounded-3xl">
                  <ul className="flex flex-col px-6 py-4 gap-3">
                    <li>
                      <a href={getColordleUrl()} onClick={() => setOpen(false)} className="block text-sm text-gray-700 hover:text-[#73aa28] transition py-2">
                        Colordle
                      </a>
                    </li>
                    <li>
                      <Link to="/" onClick={() => setOpen(false)} className="block text-sm text-gray-700 hover:text-[#73aa28] transition py-2">
                        Home
                      </Link>
                    </li>

                    <li>
                      <a
                        href="/palettes"
                        onClick={() => setOpen(false)}
                        className="block text-sm text-gray-700 hover:text-[#73aa28] transition py-2"
                      >
                        Palettes
                      </a>
                    </li>

                    <li>
                      <a
                        href="/saved"
                        onClick={() => setOpen(false)}
                        className="block text-sm text-gray-700 hover:text-[#78aa28] transition py-2"
                      >
                        Saved
                      </a>
                    </li>

                    <li>
                      <a
                        href="/about"
                        onClick={() => setOpen(false)}
                        className="block text-sm text-gray-700 hover:text-[#78aa28] transition py-2"
                      >
                        About
                      </a>
                    </li>
                  </ul>
                </div>
            )}

        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="xl:hidden py-3 flex gap-2">
          <input
            type="text"
            placeholder="Color name, HEX, or RGB"
            value={colorInput}
            onChange={(e) => { setColorInput(e.target.value); setSearchError(""); }}
                aria-label="Search by color name, HEX, or RGB"
                aria-invalid={Boolean(searchError)}
                aria-describedby={searchError ? "navbar-search-error" : undefined}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Go
          </button>
        </form>
        {searchError && <p id="navbar-search-error" role="alert" className="pb-2 text-xs text-red-700 xl:text-center">{searchError}</p>}
      </div>
    </nav>
  );
}
