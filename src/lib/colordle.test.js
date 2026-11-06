import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildShareText, getDailyPuzzle, isColordleHost, normalizeName, colorSimilarity, findNamedColor, getContrastText, NAMED_COLORS } from './colordle.js';

test('daily puzzle starts at #1 and changes at midnight Eastern Standard Time', () => {
  const first = getDailyPuzzle(new Date('2026-11-06T05:00:00Z'));
  assert.equal(first.day, 1);
  assert.equal(first.date, '2026-11-06');
  assert.deepEqual(first, getDailyPuzzle(new Date('2026-11-07T04:59:59Z')));
  const next = getDailyPuzzle(new Date('2026-11-07T05:00:00Z'));
  assert.equal(next.day, 2);
  assert.notEqual(first.hex, next.hex);
  assert.match(next.hex, /^[A-F0-9]{6}$/);
});

test('summer resets happen at midnight Eastern Daylight Time', () => {
  const before = getDailyPuzzle(new Date('2027-07-02T03:59:59Z'));
  const after = getDailyPuzzle(new Date('2027-07-02T04:00:00Z'));
  assert.equal(before.date, '2027-07-01');
  assert.equal(after.date, '2027-07-02');
  assert.equal(after.day, before.day + 1);
});

test('DST clock changes neither skip nor repeat puzzles', () => {
  for (const [beforeClockChange, afterClockChange, beforeMidnight, midnight] of [
    ['2027-03-14T06:59:59Z', '2027-03-14T07:00:00Z', '2027-03-15T03:59:59Z', '2027-03-15T04:00:00Z'],
    ['2027-11-07T05:59:59Z', '2027-11-07T06:00:00Z', '2027-11-08T04:59:59Z', '2027-11-08T05:00:00Z'],
  ]) {
    const puzzle = getDailyPuzzle(new Date(beforeClockChange));
    assert.deepEqual(getDailyPuzzle(new Date(afterClockChange)), puzzle);
    assert.deepEqual(getDailyPuzzle(new Date(beforeMidnight)), puzzle);
    assert.equal(getDailyPuzzle(new Date(midnight)).day, puzzle.day + 1);
  }
});

test('a date is shared across player time zones', () => {
  assert.deepEqual(getDailyPuzzle(new Date('2026-11-06T20:00:00-05:00')), getDailyPuzzle(new Date('2026-11-07T01:00:00Z')));
});

test('spaces, punctuation, accents, and capitalization do not affect matching', () => {
  assert.equal(normalizeName('  RóbIN’s-Egg Blue! '), 'robinseggblue');
});

test('every API color name is accepted regardless of length', () => {
  assert.ok(NAMED_COLORS.length > 1600);
  for (const color of NAMED_COLORS) {
    assert.deepEqual(findNamedColor(color.name), color);
  }
  assert.deepEqual(findNamedColor('  CURIOUS-blue '), { name: 'Curious Blue', hex: '2596D1' });
  assert.equal(findNamedColor('red').hex, 'FF0000');
  assert.equal(findNamedColor('a made up color'), null);
});

test('duplicate API names resolve consistently to the original color', () => {
  assert.equal(findNamedColor('Navy Blue').hex, '000080');
  assert.equal(new Set(NAMED_COLORS.map(color => normalizeName(color.name))).size, NAMED_COLORS.length);
});

test('every daily puzzle is an exact, guessable named swatch', () => {
  for (let day = 0; day < 366; day++) {
    const puzzle = getDailyPuzzle(new Date(Date.UTC(2026, 10, 6 + day)));
    assert.equal(findNamedColor(puzzle.name).hex, puzzle.hex);
  }
});

test('similarity compares colors, rewards nearby shades, and is symmetric', () => {
  assert.equal(colorSimilarity('2596D1', '#2596d1'), 100);
  assert.equal(colorSimilarity('000000', 'FFFFFF'), 0);
  assert.ok(colorSimilarity('000000', '000001') < 100);
  assert.ok(colorSimilarity('2596D1', '2697D2') > colorSimilarity('2596D1', 'FF0000'));
  assert.equal(colorSimilarity('2596D1', 'FF0000'), colorSimilarity('FF0000', '2596D1'));
  assert.throws(() => colorSimilarity('oops', 'FFFFFF'), /Invalid hex/);
});

test('only exact colors reach 100 and scores stay within bounds across the dataset', () => {
  const target = '2596D1';
  for (const color of NAMED_COLORS) {
    const similarity = colorSimilarity(color.hex, target);
    assert.ok(similarity >= 0 && similarity <= 100);
    assert.equal(similarity === 100, color.hex === target);
  }
});

test('share text contains puzzle number, try count, and URL without the answer', () => {
  assert.equal(buildShareText(2, 1, 'https://colordle.example.com/'), 'Colordle #2\nGuessed it in 1 try!\nhttps://colordle.example.com/');
  assert.match(buildShareText(3, 7, 'https://example.com/colordle'), /7 tries!/);
});

test('only the colordle subdomain gets the standalone game', () => {
  assert.equal(isColordleHost('colordle.example.com'), true);
  assert.equal(isColordleHost('colordle.localhost'), true);
  assert.equal(isColordleHost('example.com'), false);
  assert.equal(isColordleHost('notcolordle.example.com'), false);
});

test('guess cards choose readable black or white text for light, dark, and vivid colors', () => {
  assert.equal(getContrastText('FFFFFF'), '#000000');
  assert.equal(getContrastText('000000'), '#FFFFFF');
  assert.equal(getContrastText('FFFF00'), '#000000');
  assert.equal(getContrastText('0000FF'), '#FFFFFF');
  assert.equal(getContrastText('#ff0000'), '#000000');
});
