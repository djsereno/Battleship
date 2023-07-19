const Ship = require('./ship');

const ship = Ship(3);

beforeEach(() => ship.hit());

test('1 hits, sunk to be false', () => {
  expect(ship.isSunk()).toBe(false);
});
test('2 hits, sunk to be false', () => {
  expect(ship.isSunk()).toBe(false);
});
test('3 hits, sunk to be true', () => {
  expect(ship.isSunk()).toBe(true);
});
