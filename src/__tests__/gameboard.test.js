const Gameboard = require('../gameboard');

const gameboard = Gameboard(10);

test('Gameboard array is all 0\'s', () => {
  for (let i = 0; i < gameboard.size; i++) {
    for (let j = 0; j < gameboard.size; j++) {
      expect(gameboard.board[i][j]).toBe(0);
    }
  }
});

describe.each([
  [5, [1, 1], 'H', true],
  [4, [0, 1], 'V', false],
  [4, [0, 5], 'V', false],
  [4, [0, 6], 'V', true],
  [3, [8, 8], 'V', false],
  [3, [8, 8], 'H', false],
  [3, [8, 7], 'H', true],
  [2, [0, 5], 'H', false],
  [2, [0, 5], 'V', false],
  [2, [0, 4], 'V', false],
  [2, [0, 4], 'H', true],
  [3, [-1, 7], 'H', false],
  [3, [4, 4], 'V', true],
])('Ship placement: ', (size, coord, dir, expected) => {
  test(`${size} long at ${coord} (${dir}) returns ${expected}`, () => {
    expect(gameboard.placeShip(size, coord, dir)).toBe(expected);
  });
});
