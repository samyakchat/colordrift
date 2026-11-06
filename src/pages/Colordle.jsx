import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { InformationCircleIcon, XMarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import {
  buildShareText, getDailyPuzzle, getMainSiteUrl, normalizeName, colorSimilarity, findNamedColor, getContrastText, NAMED_COLORS,
} from '../lib/colordle';
import './colordle.css';

function readSaved(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Play remains available when browser storage is disabled or full.
  }
}

function DailyGame({ puzzle }) {
  // Version 2 starts a clean history for the new color-based rules.
  const storageKey = `colordle:v2:${puzzle.date}`;
  const [guesses, setGuesses] = useState(() => {
    const saved = readSaved(storageKey);
    if (!Array.isArray(saved)) return [];
    const names = [...new Set(saved.filter(value => typeof value === 'string').map(normalizeName))];
    const valid = names.map(findNamedColor).filter(Boolean);
    // Never restore attempts after a winning guess.
    const winningIndex = valid.findIndex(guess => guess.hex === puzzle.hex);
    return winningIndex < 0 ? valid : valid.slice(0, winningIndex + 1);
  });
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [shareStatus, setShareStatus] = useState('');
  const [manualShare, setManualShare] = useState('');
  const won = guesses.some(guess => guess.hex === puzzle.hex);
  const query = normalizeName(input);
  const suggestions = query ? NAMED_COLORS.filter(color => normalizeName(color.name).includes(query)).slice(0, 12) : [];

  useEffect(() => {
    save(storageKey, guesses.map(guess => normalizeName(guess.name)));
  }, [guesses, storageKey]);

  function submitGuess(event) {
    event.preventDefault();
    if (won) return;
    if (getDailyPuzzle().date !== puzzle.date) {
      setError('A new color is ready. Refresh to play today’s puzzle.');
      return;
    }
    const guess = findNamedColor(input);
    if (!guess) {
      setError('That name isn’t in the color list. Try a name like Curious Blue, or choose a suggestion.');
      return;
    }
    if (guesses.some(previous => normalizeName(previous.name) === normalizeName(guess.name))) {
      setError('You’ve already tried that color. Try another!');
      return;
    }
    setGuesses(previous => [...previous, guess]);
    setInput('');
    setError('');
  }

  function revealDevColor() {
    const code = window.prompt('Enter the dev code:');
    if (code === null) return;
    if (code === '5678') {
      window.alert(`Today’s color is ${getDailyPuzzle().name}`);
    } else {
      window.alert('Incorrect dev code.');
    }
  }

  async function share() {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    const text = buildShareText(puzzle.day, guesses.length, url.href);
    try {
      await navigator.clipboard.writeText(text);
      setShareStatus('Results copied!');
      setManualShare('');
    } catch {
      setManualShare(text);
      setShareStatus('Select and copy your results below.');
    }
  }

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-6 pb-14 pt-10 sm:pt-14">
      <h1 className="!my-3 !text-4xl font-semibold tracking-tight text-gray-900">Color of the day</h1>
      <p className="text-sm text-gray-500">Colordle #{puzzle.day} <span aria-hidden="true">·</span> {puzzle.date}</p>
      <div
        className="mx-auto my-8 flex h-44 w-44 items-center justify-center rounded-full border border-black/10 sm:h-48 sm:w-48"
        style={{ backgroundColor: won ? `#${puzzle.hex}` : '#F3F4F6' }}
        role="img"
        aria-label={won ? `Today’s color: ${puzzle.name}` : 'Mystery color — guess to reveal'}
      >
        {!won && <span aria-hidden="true" className="text-6xl font-medium text-gray-400">?</span>}
      </div>

      <form onSubmit={submitGuess} className="text-left">
        <label htmlFor="color-guess" className="mb-2 block text-sm font-medium text-gray-700">Make a color guess</label>
        <div className="flex overflow-hidden rounded-md border border-gray-300 bg-white transition focus-within:border-[#73aa28] focus-within:ring-1 focus-within:ring-[#73aa28]">
          <input
            id="color-guess"
            value={input}
            onChange={event => { setInput(event.target.value); setError(''); }}
            list="color-name-suggestions"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={80}
            disabled={won}
            aria-describedby={error ? 'guess-error color-hint' : 'color-hint'}
            aria-invalid={Boolean(error)}
            className="min-w-0 flex-1 bg-white px-3 py-3 text-sm text-gray-900 outline-none disabled:bg-gray-50"
          />
          <button type="submit" disabled={won || !input.trim()} className="border-l border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-default disabled:text-gray-400">Guess</button>
        </div>
        {error && <p id="guess-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        <datalist id="color-name-suggestions">
          {suggestions.map(color => <option key={color.name} value={color.name} />)}
        </datalist>
      </form>
      <div aria-live="polite" aria-atomic="true">
        {won ? (
          <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-5">
            <h2 className="!mb-2 !text-xl text-gray-900">You guessed it in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!</h2>
            <p className="text-sm text-gray-600">Today’s color is <strong className="font-semibold text-gray-900">{puzzle.name}</strong>.</p>
            <button type="button" onClick={share} className="colordle-button mt-4 inline-flex items-center gap-2"><ShareIcon className="h-4 w-4" aria-hidden="true" />Share results</button>
            {shareStatus && <p className="mt-3 text-sm text-gray-600">{shareStatus}</p>}
            {manualShare && <textarea aria-label="Results to copy" readOnly value={manualShare} onFocus={event => event.target.select()} className="mt-3 w-full rounded-md border border-gray-300 bg-white p-3 text-sm text-gray-900" rows={4} />}
          </div>
        ) : <div className="mt-3"><p className="mt-3 text-xs text-gray-500">quickly</p></div>}
      </div>
      <section aria-label="Your guesses" aria-live="polite" aria-relevant="additions" className="mt-8 text-left">
        <div className="mb-3 flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium uppercase tracking-wider">Your guesses</span>
          <span>{guesses.length} {guesses.length === 1 ? 'try' : 'tries'}</span>
        </div>
        {guesses.length === 0 ? <p className="rounded-md border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-400">start guessing pls</p> : (
          <ol reversed start={guesses.length} className="space-y-3">
            {[...guesses].reverse().map((guess, displayIndex) => {
              const index = guesses.length - 1 - displayIndex;
              const similarity = colorSimilarity(guess.hex, puzzle.hex);
              const exact = guess.hex === puzzle.hex;
              const previousSimilarity = index > 0 ? colorSimilarity(guesses[index - 1].hex, puzzle.hex) : null;
              const direction = previousSimilarity === null ? null : similarity > previousSimilarity ? 'Closer' : similarity < previousSimilarity ? 'Further away' : 'Same similarity';
              return (
                <li
                  key={guess.name}
                  value={index + 1}
                  className="rounded-md border border-black/10 p-4 sm:p-5"
                  style={{ backgroundColor: `#${guess.hex}`, color: getContrastText(guess.hex) }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs">Guess {index + 1}</p>
                      <p className="break-words text-sm font-semibold">{guess.name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold tabular-nums">{`${similarity.toFixed(2)}%`} <span className="font-normal">similar</span></p>
                      <p className="text-xs">{exact ? 'Exact match!' : direction || 'Keep exploring'}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </section>
      <div className="mt-3">
        <p className="mt-8 text-xs text-gray-400">New color everyday</p>
      </div>
      <button type="button" onClick={revealDevColor} className="colordle-button mt-4">Dev</button>
    </main>
  );
}

export default function Colordle() {
  const [puzzle, setPuzzle] = useState(getDailyPuzzle);
  const [infoOpen, setInfoOpen] = useState(false);
  const mainSiteUrl = getMainSiteUrl();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'Colordle by colordrift';
    function updateDay() {
      const next = getDailyPuzzle();
      setPuzzle(current => current.date === next.date ? current : next);
    }
    const timer = setInterval(updateDay, 1000);
    window.addEventListener('focus', updateDay);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', updateDay);
      document.title = previousTitle;
    };
  }, []);

  return (
    <div className="colordle flex min-h-svh flex-col bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <a href={mainSiteUrl} className="flex items-center gap-2 text-left" aria-label="Colordle by colordrift — visit colordrift">
            <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
            <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2"><span className="text-2xl font-semibold tracking-tight">Colordle</span><span className="text-xs text-gray-500 sm:text-sm">by <span className="font-semibold text-gray-700">colordrift</span></span></span>
          </a>
          <button onClick={() => setInfoOpen(true)} className="colordle-button inline-flex items-center gap-2" aria-label="How to play and about Colordle"><InformationCircleIcon className="h-5 w-5" aria-hidden="true" /><span className="hidden sm:inline">How to play</span></button>
        </div>
      </header>
      <DailyGame key={puzzle.date} puzzle={puzzle} />
      <footer className="border-t border-gray-200 px-6 py-5 text-xs text-gray-500">A daily color break by <a className="font-medium text-gray-700 hover:text-[#73aa28]" href={mainSiteUrl}>colordrift</a>.</footer>
      <Dialog open={infoOpen} onClose={setInfoOpen} className="relative z-50">
        <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-8">
          <div className="flex min-h-full items-center justify-center">
            <DialogPanel className="colordle relative w-full max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-left shadow-xl sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <DialogTitle as="h2" className="!mb-5 !text-2xl font-semibold text-gray-900">How to play</DialogTitle>
                <button onClick={() => setInfoOpen(false)} className="rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="Close information"><XMarkIcon className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-gray-600">
                <p>Find today’s hidden color. You have unlimited tries, and everyone gets the same mystery color each day. Start with any color name and let the similarity hints guide you.</p>
                <p>Try any name from The Color API’s color list, including shades like Curious Blue. Start typing to see suggestions. Spaces, hyphens, and capitalization don’t affect your guess.</p>
                <p>After you submit a guess, its card shows that color with a similarity percentage, like <strong>32.58% similar</strong>. The score compares how the colors look, using their hue, lightness, and saturation. Higher percentages mean you’re closer. Your newest guess appears at the top.</p>
                <p>Use your guess colors and the “Closer” or “Further away” feedback to guide your next guess. Find the exact color to reach <strong>100.00%</strong> and win. Names can have any number of letters.</p>
                <p>Once you solve it, share your try count without giving away the answer. A new puzzle arrives at midnight UTC. Progress is saved in this browser.</p>
              </div>
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h2 className="!mb-3 !text-2xl text-gray-900">About Colordle</h2>
                <p className="text-sm leading-relaxed text-gray-600">A little daily challenge for your eye for color. Colordle is part of colordrift, built to make exploring color a little more playful.</p>
                <p className="mt-4 text-sm text-[#679924]">Driven by <a href="https://www.thecolorapi.com/" target="_blank" rel="noreferrer" className="underline underline-offset-2">The Color API</a></p>
                <p className="mt-4 text-sm text-gray-900">Project by Samyak Chatterjee</p>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
