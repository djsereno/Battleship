const Gameboard = require('./gameboard');

const gameboard = Gameboard(3);

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
  [3, [7, 8], 'H', true],
])();


test('Place 5 long ship horizontally at 1, 1', () => {
  expect(gameboard.checkPlacement(5, [1, 1], 'horiz')).toBe(true);
});
test('Place 4 long ship vertically at 0, 1', () => {
  expect(gameboard.checkPlacement((4)[(1, 1)], 'vert')).toBe(true);
});
