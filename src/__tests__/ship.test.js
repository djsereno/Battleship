import Ship from '../ship';
import { SHIP_KEYS, SHIP_NAMES, SHIP_SIZES } from '../globals';

describe.each(SHIP_KEYS)('Test ship creation:', (shipKey) => {
  const ship = Ship(shipKey);
  const { size } = ship;

  test(`${shipKey} size to be ${SHIP_SIZES[shipKey]}`, () => {
    expect(ship.size).toBe(SHIP_SIZES[shipKey]);
  });
  test(`${shipKey} name to be ${SHIP_NAMES[shipKey]}`, () => {
    expect(ship.name).toBe(SHIP_NAMES[shipKey]);
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
