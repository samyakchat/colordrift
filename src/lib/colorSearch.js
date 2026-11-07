import { findNamedColor } from './colordle.js';

export function resolveColorSearch(value) {
  const input = value.trim();
  const named = /[\d#]/.test(input) ? null : findNamedColor(input);
  if (named) return named.hex;

  const hex = input.match(/^#?([a-f\d]{6}|[a-f\d]{3})$/i)?.[1];
  if (hex) {
    return (hex.length === 3 ? [...hex].map(channel => channel.repeat(2)).join('') : hex).toUpperCase();
  }

  const rgb = input.match(/^(?:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)|(\d+)\s*,\s*(\d+)\s*,\s*(\d+))$/i);
  if (rgb) {
    const channels = (rgb[1] === undefined ? rgb.slice(4, 7) : rgb.slice(1, 4)).map(Number);
    if (channels.some(channel => channel > 255)) return null;
    return channels.map(channel => channel.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  return null;
}
