import Ship from '../ship';

const ship = Ship('SUB');

describe('Testing hits', () => {
  beforeEach(() => ship.hit());

  test('1 hits, sunk to be false', () => {
    expect(ship.size).toBe(3);
    expect(ship.damage).toBe(1);
    expect(ship.isSunk()).toBe(false);
  });
  test('2 hits, sunk to be false', () => {
    expect(ship.size).toBe(3);
    expect(ship.damage).toBe(2);
    expect(ship.isSunk()).toBe(false);
  });
  test('3 hits, sunk to be true', () => {
    expect(ship.size).toBe(3);
    expect(ship.damage).toBe(3);
    expect(ship.isSunk()).toBe(true);
  });
});
