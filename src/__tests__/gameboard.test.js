import Gameboard from '../gameboard';
import { SHIP_KEYS } from '../globals';

const gameboard = Gameboard();
afterAll(() => gameboard.prettyPrint('Gameboard tests:'));

describe('Board initialization:', () => {
  test(`All squares to be 0`, () => {
    gameboard.array.forEach((row) =>
      row.forEach((cell) => {
        expect(cell).toEqual({ state: 0 });
      }),
    );
  });
});

describe.each([
  ['CAR', [1, 1], 'H', true],
  ['BAT', [0, 1], 'V', false],
  ['BAT', [0, 5], 'V', false],
  ['BAT', [0, 6], 'V', true],
  ['CRU', [8, 8], 'V', false],
  ['CRU', [8, 8], 'H', false],
  ['CRU', [8, 7], 'H', true],
  ['DES', [0, 5], 'H', false],
  ['DES', [0, 5], 'V', false],
  ['DES', [0, 4], 'V', false],
  ['DES', [0, 4], 'H', true],
  ['SUB', [-1, 7], 'H', false],
  ['SUB', [4, 4], 'V', true],
])('Ship placement:', (ship, coord, dir, expected) => {
  test(`${ship} long at ${coord} (${dir}) returns ${expected}`, () => {
    expect(gameboard.placeShip(ship, coord, dir)).toBe(expected);
  });
});

describe.each(SHIP_KEYS)('Ships exist and are not sunk:', (ship) => {
  test(`${ship} is defined and not sunk`, () => {
    expect(gameboard.ships[ship]).toBeDefined();
    expect(gameboard.ships[ship].isSunk()).toBe(false);
  });
});

describe.each([
  [[-1, 1], undefined, -1],
  [[10, 1], undefined, -1],
  [[0, 3], false, -1],
  [[0, 4], true, 1, 1, false],
  [[0, 5], true, 1, 2, true],
  [[0, 6], true, 1, 1, false],
  [[0, 7], false, -1],
  [[1, 6], true, 1, 2, false],
  [[2, 6], true, 1, 3, false],
  [[3, 6], true, 1, 4, true],
  [[4, 4], true, 1, 1, false],
  [[5, 4], true, 1, 2, false],
  [[6, 4], true, 1, 3, true],
  [[8, 7], true, 1, 1, false],
  [[8, 8], true, 1, 2, false],
  [[8, 9], true, 1, 3, true],
  [[1, 0], false, -1],
  [[1, 1], true, 1, 1, false],
  [[1, 2], true, 1, 2, false],
  [[1, 3], true, 1, 3, false],
  [[1, 4], true, 1, 4, false],
])('Attacks:', (coord, hit, state, damage, isSunk) => {
  const [row, col] = coord;

  test(`Attack ${coord}`, () => {
    expect(gameboard.receiveAttack(coord)).toBe(hit);
    if (hit !== undefined) expect(gameboard.array[row][col].state).toBe(state);
    if (hit) {
      expect(gameboard.getCell([row, col]).ship.damage).toBe(damage);
      expect(gameboard.getCell([row, col]).ship.isSunk()).toBe(isSunk);
    }
    expect(gameboard.checkGameOver()).toBe(false);
  });
});

describe('Game over:', () => {
  test('Attack 1,5', () => {
    expect(gameboard.receiveAttack([1, 5])).toBe(true);
    expect(gameboard.getCell([1, 5]).state).toBe(1);
    expect(gameboard.getCell([1, 5]).ship.damage).toBe(5);
    expect(gameboard.getCell([1, 5]).ship.isSunk()).toBe(true);
    expect(gameboard.checkGameOver()).toBe(true);
  });
});
