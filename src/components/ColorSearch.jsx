import { useId, useState } from 'react';
import { resolveColorSearch } from '../lib/colorSearch.js';

export default function ColorSearch({ onSearch, compact = false }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const errorId = useId();

  function submit(event) {
    event.preventDefault();
    const hex = resolveColorSearch(input);
    if (!hex) {
      setError('Enter a color name from The Color API, a hex code, or RGB values (0–255).');
      return;
    }
    setError('');
    onSearch(hex);
  }

  return (
    <form onSubmit={submit} className={compact ? 'text-left' : 'max-w-xl mx-auto mb-12 text-left'}>
      <div className={`flex ${compact ? 'overflow-hidden rounded-md border border-gray-300 focus-within:border-[#73aa28] focus-within:ring-1 focus-within:ring-[#73aa28]' : 'gap-3'}`}>
        <input
          type="text"
          aria-label="Search by color name, HEX, or RGB"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={input}
          onChange={event => { setInput(event.target.value); setError(''); }}
          placeholder={compact ? 'Color name, HEX, or RGB' : 'Name, HEX, or RGB (e.g. Curious Blue)'}
          className={`min-w-0 flex-1 bg-white text-gray-900 outline-none ${compact ? 'px-2.5 py-1.5 text-base sm:text-xs' : 'border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#73aa28] focus:border-transparent px-5 py-3 text-base sm:text-sm'}`}
        />
        <button type="submit" disabled={!input.trim()} className={`shrink-0 transition font-medium disabled:opacity-50 disabled:cursor-default ${compact ? 'border-l border-gray-300 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100' : 'bg-[#73aa28] text-white rounded-lg hover:bg-[#92d13d] px-6 py-3'}`}>
          Search
        </button>
      </div>
      {error && <p id={errorId} role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </form>
  );
}
