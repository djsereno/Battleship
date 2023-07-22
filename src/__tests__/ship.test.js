import Ship from '../ship';
import { SHIP_KEYS } from '../globals';

describe.each(SHIP_KEYS)('Test ship creation:', (shipKey) => {
  const ship = Ship(shipKey);
  const { size } = ship;

  test(`${shipKey} size to be ${size}`, () => {
    expect(ship.size).toBe(size);
  });

  describe('Attack ship:', () => {
    afterEach(() => ship.hit());

    for (let i = 0; i < size; i += 1) {
      test(`${shipKey} damage to be ${i}/${size}`, () => {
        expect(ship.damage).toBe(i);
        expect(ship.isSunk()).toBe(false);
      });
    }
    test(`${shipKey} damage to be ${size}/${size} (sunk)`, () => {
      expect(ship.damage).toBe(size);
      expect(ship.isSunk()).toBe(true);
    });
  });
});
