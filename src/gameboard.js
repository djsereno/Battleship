const Ship = require('./ship');

const Gameboard = (size) => {
  const _size = size;
  const _board = Array(_size)
    .fill(0)
    .map((row) => Array(_size).fill({ state: 0 }));

  // TODO: Probably makes more sense for this to be in the Ship factory function
  const SHIPS = {
    CAR: 5,
    BAT: 4,
    CRU: 3,
    SUB: 3,
    DES: 2,
  };

  const checkPlacement = (size, startCoord, direction) => {
    let [row, col] = startCoord;
    for (let i = 0; i < size; i++) {
      if (row < 0 || row >= _size || col < 0 || col >= _size) return false;
      if (_board[row][col].ship) return false;
      direction === 'H' ? col++ : row++;
    }
    return true;
  };

  const placeShip = (shipName, startCoord, direction) => {
    const size = SHIPS[shipName];
    const ship = Ship(size);
    if (!checkPlacement(size, startCoord, direction)) return false;

    let [row, col] = startCoord;
    for (let i = 0; i < size; i++) {
      _board[row][col] = { state: 0, ship: ship };
      direction === 'H' ? col++ : row++;
    }
    return true;
  };

  const receiveAttack = (coord) => {
    let [row, col] = coord;
    let cell = _board[row][col];
    if (cell.ship === undefined) {
      cell.state = -1;
      return false;
    }
    cell.state = 1;
    return true;
  };

  return {
    placeShip,
    receiveAttack,
    get size() {
      return _size;
    },
    get board() {
      return _board;
    },
  };
};

module.exports = Gameboard;
