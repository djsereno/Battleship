const Gameboard = require('./gameboard');

const gameboard = Gameboard(10);

test('Gameboard array', () => {
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
])('Ship placement: ', (size, coord, dir, expected) => {
  test(`${size} long at ${coord} (${dir}) returns ${expected}`, () => {
    expect(gameboard.placeShip(size, coord, dir)).toBe(expected);
  });
});
