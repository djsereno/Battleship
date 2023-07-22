const Gameboard = require('../gameboard');

const gameboard = Gameboard(10);
afterAll(() => gameboard.prettyPrint());

describe('Board initialization:', () => {
  for (let i = 0; i < gameboard.size; i += 1) {
    for (let j = 0; j < gameboard.size; j += 1) {
      test(`${i},${j} to be 0`, () => {
        expect(gameboard.board[i][j]).toEqual({ state: 0 });
      });
    }
  }
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

describe.each(['CAR', 'BAT', 'CRU', 'SUB', 'DES'])('Ships exist and are not sunk:', (ship) => {
  test(`${ship} is defined`, () => {
    expect(gameboard.ships[ship]).toBeDefined();
  });
  test(`${ship} is not sunk`, () => {
    expect(gameboard.ships[ship].isSunk()).toBe(false);
  });
});

describe.each([
  [[-1, 1], undefined, -1],
  [[10, 1], undefined, -1],
  [[0, 0], false, -1],
  [[0, 1], false, -1],
  [[0, 2], false, -1],
  [[0, 3], false, -1],
  [[0, 4], true, 1, 1, false],
  [[0, 5], true, 1, 2, true],
  [[0, 6], true, 1, 1, false],
  [[0, 7], false, -1],
  [[4, 4], true, 1, 1, false],
  [[5, 4], true, 1, 2, false],
  [[6, 4], true, 1, 3, true],
])('Attacks:', (coord, hit, state, damage, isSunk) => {
  const [row, col] = coord;

  test(`Attack ${coord} returns ${hit}`, () => {
    expect(gameboard.receiveAttack(coord)).toBe(hit);
  });

  if (hit !== undefined) {
    test(`Board cell state is ${state}`, () => {
      expect(gameboard.board[row][col].state).toBe(state);
    });
  }

  if (hit) {
    test(`Damage is ${damage}`, () => {
      expect(gameboard.board[row][col].ship.damage).toBe(damage);
    });
    test(`isSunk is ${isSunk}`, () => {
      expect(gameboard.board[row][col].ship.isSunk()).toBe(isSunk);
    });
  }
});
