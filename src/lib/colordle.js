import colorNames from './colorNames.js';

// The upstream list includes duplicate names for different RGB values. Keep
// the first (original) entry for each name so a name always resolves to one
// color, and never choose an ambiguous, unreachable daily target.
const colorsByName = new Map();
for (const color of colorNames) {
  const key = normalizeName(color.name);
  if (!colorsByName.has(key)) colorsByName.set(key, color);
}
const API_NAMED_COLORS = [...colorsByName.values()];
export const NAMED_COLORS = [...API_NAMED_COLORS];

// Familiar, guessable shades that are missing from the upstream naming set.
const COMMON_COLORS = [
  ['Light Purple', 'D8B4FE'], ['Dark Purple', '6B21A8'], ['Light Green', '90EE90'],
  ['Dark Green', '006400'], ['Light Blue', 'ADD8E6'], ['Dark Red', '8B0000'],
  ['Pink', 'FFC0CB'], ['Beige', 'F5F5DC'], ['Tan', 'D2B48C'], ['Brown', '8B4513'],
  ['Gray', '808080'], ['Grey', '808080'], ['Mint Green', '98FF98'], ['Sage Green', '9CAF88'],
];
for (const [name, hex] of COMMON_COLORS) {
  const key = normalizeName(name);
  if (!colorsByName.has(key)) {
    const color = { name, hex };
    colorsByName.set(key, color);
    NAMED_COLORS.push(color);
  }
}

// Puzzle #1 is November 6, 2026. Everyone resets at midnight New York time,
// including the automatic switch between EST and EDT.
const EPOCH = Date.UTC(2026, 10, 6);
const DAY_MS = 86_400_000;
const puzzleDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

export function getDailyPuzzle(now = new Date()) {
  const { year, month, day: dayOfMonth } = Object.fromEntries(
    puzzleDateFormatter.formatToParts(now).map(({ type, value }) => [type, value]),
  );
  const date = `${year}-${month}-${dayOfMonth}`;
  // Count calendar dates with UTC arithmetic so 23/25-hour DST days still
  // advance the puzzle number exactly once.
  const day = Math.floor((Date.parse(`${date}T00:00:00Z`) - EPOCH) / DAY_MS) + 1;
  // A deterministic date seed: no per-visitor randomness.
  const seed = ((day * 2654435761) >>> 0) & 0xffffff;
  // Use an actual named swatch so a name guess can match the target exactly.
  return { date, day, ...API_NAMED_COLORS[seed % API_NAMED_COLORS.length] };
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
  if (guess.every((value, index) => value === target[index])) return 100;

  // Oklab's a/b plane gives a useful hue angle and chroma. Keep lightness and
  // chroma differences meaningful, while letting related hues (including
  // neighboring and opposing color families) score more intuitively.
  const [gL, ga, gb] = guess;
  const [tL, ta, tb] = target;
  const gC = Math.hypot(ga, gb);
  const tC = Math.hypot(ta, tb);
  const hueAngle = Math.atan2(ga, gb) - Math.atan2(ta, tb);
  const hueDistance = Math.abs(Math.atan2(Math.sin(hueAngle), Math.cos(hueAngle))) / Math.PI;
  const chromaScale = Math.min(1, Math.min(gC, tC) / 0.08);
  // Hue matters less for muted colors. Closely related hues score well;
  // complementary hues still get partial credit rather than a near-zero score.
  const huePenalty = Math.min(hueDistance, 1 - hueDistance * 0.45) * chromaScale;
  const distance = Math.hypot((gL - tL) * 0.9, (gC - tC) * 0.8, huePenalty * 0.28);
  if (distance > 0.95) return 0;
  let score = 100 * Math.exp(-distance * 2.2);
  // A familiar hue family should still feel close even when its shade differs
  // in lightness or saturation (for example, basic green vs. Chalet Green).
  if (chromaScale > 0.4 && hueDistance < 0.22) score = Math.max(score, 65 + (0.22 - hueDistance) * 20);
  // Opposing hues receive meaningful, but clearly lower, partial credit.
  if (chromaScale > 0.4 && hueDistance > 0.82) score = Math.max(score, 38);
  return Math.min(99.99, Math.max(0, Math.round(score * 100) / 100));
}

const SUGGESTION_SEEDS = {
  green: ['Chalet Green', 'Sage Green', 'Mint Green', 'Light Green', 'Dark Green'],
  purple: ['Light Purple', 'Dark Purple', 'Wisteria'],
  blue: ['Light Blue', 'Navy Blue', 'Dark Blue'],
  brown: ['Brown', 'Cocoa Brown', 'Sisal', 'Tan', 'Beige'],
  beige: ['Beige', 'Sisal', 'Tan'],
  tan: ['Tan', 'Sisal', 'Beige'],
  red: ['Dark Red', 'Pink'],
};

export function getColorSuggestions(query, limit = 12) {
  const normalized = normalizeName(query);
  if (!normalized) return [];
  const ranked = new Map();
  const add = (color, rank) => {
    if (!color) return;
    const current = ranked.get(color.name);
    if (!current || rank < current.rank) ranked.set(color.name, { color, rank });
  };
  for (const color of NAMED_COLORS) {
    const name = normalizeName(color.name);
    if (name === normalized) add(color, -2);
    else if (name.startsWith(normalized)) add(color, -1);
    else if (name.includes(normalized)) add(color, 0);
  }
  for (const [family, names] of Object.entries(SUGGESTION_SEEDS)) {
    if (normalizeName(family) === normalized || normalized === `${family}color`) {
      names.forEach((name, index) => add(findNamedColor(name), -3 + index / 100));
    }
  }
  return [...ranked.values()].sort((a, b) => a.rank - b.rank)
    .slice(0, limit).map(({ color }) => color);
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
