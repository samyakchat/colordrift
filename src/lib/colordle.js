import colorNames from './colorNames.js';

// The upstream list includes duplicate names for different RGB values. Keep
// the first (original) entry for each name so a name always resolves to one
// color, and never choose an ambiguous, unreachable daily target.
const colorsByName = new Map();
for (const color of colorNames) {
  const key = normalizeName(color.name);
  if (!colorsByName.has(key)) colorsByName.set(key, color);
}
export const NAMED_COLORS = [...colorsByName.values()];

// Puzzle #1 is November 6, 2026. All players roll over at midnight UTC.
const EPOCH = Date.UTC(2026, 10, 6);
const DAY_MS = 86_400_000;

export function getDailyPuzzle(now = new Date()) {
  const date = now.toISOString().slice(0, 10);
  const day = Math.floor((Date.parse(`${date}T00:00:00Z`) - EPOCH) / DAY_MS) + 1;
  // A deterministic date seed: no per-visitor randomness.
  const seed = ((day * 2654435761) >>> 0) & 0xffffff;
  // Use an actual named swatch so a name guess can match the target exactly.
  return { date, day, ...NAMED_COLORS[seed % NAMED_COLORS.length] };
}

export function normalizeName(value) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z]/g, '');
}

export function findNamedColor(name) {
  return colorsByName.get(normalizeName(name)) || null;
}

export function getContrastText(hex) {
  const clean = hex.replace(/^#/, '');
  if (!/^[a-f0-9]{6}$/i.test(clean)) throw new Error('Invalid hex color');
  const channels = [0, 2, 4].map(offset => {
    const channel = parseInt(clean.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  const blackContrast = (luminance + 0.05) / 0.05;
  const whiteContrast = 1.05 / (luminance + 0.05);
  return blackContrast >= whiteContrast ? '#000000' : '#FFFFFF';
}

// Björn Ottosson's sRGB → Oklab conversion (public domain):
// https://bottosson.github.io/posts/oklab/#converting-from-linear-srgb-to-oklab
function toOklab(hex) {
  const clean = hex.replace(/^#/, '');
  if (!/^[a-f0-9]{6}$/i.test(clean)) throw new Error('Invalid hex color');
  const [r, g, b] = [0, 2, 4].map(offset => {
    const channel = parseInt(clean.slice(offset, offset + 2), 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s,
  ];
}

export function colorSimilarity(guessHex, targetHex) {
  const guess = toOklab(guessHex);
  const target = toOklab(targetHex);
  const distance = Math.hypot(...guess.map((value, index) => value - target[index]));
  if (distance === 0) return 100;
  // Game score: map perceptual distance onto 0–100. Only an exact RGB match
  // receives 100%; rounding must never mark a near match as solved.
  return Math.min(99.99, Math.max(0, Math.round((1 - distance) * 10000) / 100));
}

export function buildShareText(day, tries, url) {
  return `Colordle #${day}\nGuessed it in ${tries} ${tries === 1 ? 'try' : 'tries'}!\n${url}`;
}

export function isColordleHost(hostname) {
  return hostname.toLowerCase().startsWith('colordle.');
}

export function getColordleUrl() {
  return import.meta.env.VITE_COLORDLE_URL || '/colordle';
}

export function getMainSiteUrl() {
  if (import.meta.env.VITE_SITE_URL) return import.meta.env.VITE_SITE_URL;
  const url = new URL(window.location.origin);
  if (isColordleHost(url.hostname)) url.hostname = url.hostname.slice('colordle.'.length);
  return url.origin;
}
