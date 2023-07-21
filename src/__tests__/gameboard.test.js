const Gameboard = require('../gameboard');

const gameboard = Gameboard(10);

describe("Gameboard array is all 0's", () => {
  for (let i = 0; i < gameboard.size; i++) {
    for (let j = 0; j < gameboard.size; j++) {
      test(`${i},${j} to be 0`, () => {
        expect(gameboard.board[i][j].state).toBe(0);
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
])('Ship placement: ', (ship, coord, dir, expected) => {
  test(`${ship} long at ${coord} (${dir}) returns ${expected}`, () => {
    expect(gameboard.placeShip(ship, coord, dir)).toBe(expected);
  });
});

const setupTestBoard = () => {
  gameboard.placeShip('CAR', [1, 1], 'H');
  gameboard.placeShip('BAT', [0, 6], 'V');
  gameboard.placeShip('CRU', [8, 7], 'H');
  gameboard.placeShip('DES', [0, 4], 'H');
  gameboard.placeShip('SUB', [4, 4], 'V');
};

describe.each([
  [[0, 0], false, -1],
  [[0, 1], false, -1],
  [[0, 2], false, -1],
  [[0, 3], false, -1],
  [[0, 4], true, 1],
  [[0, 5], true, 1],
  [[0, 6], true, 1],
  [[0, 7], false, -1],
  [[5, 4], true, 1],
  [[6, 4], true, 1],
  [[7, 4], false, -1],
])('Attack: ', (coord, hit, state) => {
  beforeAll(setupTestBoard);

  test(`Attack ${coord} returns ${hit}`, () => {
    expect(gameboard.receiveAttack(coord)).toBe(hit);
  });
  test(`Board cell state is ${state}`, () => {
    let [row, col] = coord;
    expect(gameboard.board[row][col].state).toBe(state);
  });
});
