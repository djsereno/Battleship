const Gameboard = require('../gameboard');

const gameboard = Gameboard(10);

test("Gameboard array is all 0's", () => {
  for (let i = 0; i < gameboard.size; i++) {
    for (let j = 0; j < gameboard.size; j++) {
      expect(gameboard.board[i][j]).toBe(0);
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
])('Ship placement: ', (size, coord, dir, expected) => {
  test(`${size} long at ${coord} (${dir}) returns ${expected}`, () => {
    expect(gameboard.placeShip(size, coord, dir)).toBe(expected);
  });
});
