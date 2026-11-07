import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveColorSearch } from './colorSearch.js';
import { NAMED_COLORS } from './colordle.js';

test('every API color name resolves to the same swatch used by Colordle', () => {
  for (const color of NAMED_COLORS) {
    assert.equal(resolveColorSearch(color.name), color.hex, color.name);
  }
  assert.equal(resolveColorSearch('  curious-BLUE  '), resolveColorSearch('Curious Blue'));
});

test('hex and RGB searches resolve to six-digit color routes', () => {
  for (const input of ['#78aa23', '78AA23', 'rgb(120, 170, 35)', '120, 170, 35']) {
    assert.equal(resolveColorSearch(input), '78AA23');
  }
  assert.equal(resolveColorSearch('#abc'), 'AABBCC');
  assert.equal(resolveColorSearch('RGB(0, 255, 16)'), '00FF10');
});

test('unknown names and malformed color values stay out of color routes', () => {
  for (const input of ['', 'unknown color name', 'red123', '#red', '#12345', 'rgb(256, 0, 0)', 'rgb(-1, 0, 0)', 'rgb(1.5, 0, 0)', 'rgb(0, 0, 0', '0, 0, 0)']) {
    assert.equal(resolveColorSearch(input), null, input);
  }
});
