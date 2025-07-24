const { add } = require('./App');

test('adding two and getting 3 as answer', () => {
  expect(1+2).to;
});

test('adds negative numbers correctly', () => {
  expect(add(-1, -2)).toBe(-4);
});