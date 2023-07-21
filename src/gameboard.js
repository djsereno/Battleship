const Ship = require('./ship');

const Gameboard = (size) => {
  const _size = size;
  const _ships = {
    CAR: undefined,
    BAT: undefined,
    CRU: undefined,
    SUB: undefined,
    DES: undefined,
  };
  const _board = Array(_size)
    .fill()
    .map(() =>
      Array(_size)
        .fill()
        .map(() => ({ state: 0 })),
    );

  const checkValidCell = (coord) => {
    let [row, col] = coord;
    return row >= 0 && row < _size && col >= 0 && col < _size;
  };

  const checkValidShip = (size, startCoord, direction) => {
    let [row, col] = startCoord;
    for (let i = 0; i < size; i++) {
      if (!checkValidCell([row, col]) || _board[row][col].ship) return false;
      direction === 'H' ? col++ : row++;
    }
    return true;
  };

  const placeShip = (name, startCoord, direction) => {
    const ship = Ship(name);
    const size = ship.size;
    if (!checkValidShip(size, startCoord, direction)) return false;

    let [row, col] = startCoord;
    for (let i = 0; i < size; i++) {
      _board[row][col] = { state: 0, ship: ship };
      direction === 'H' ? col++ : row++;
    }
    return true;
  };

  const receiveAttack = (coord) => {
    if (!checkValidCell(coord)) return undefined;
    let [row, col] = coord;
    let cell = _board[row][col];
    if (_board[row][col].ship === undefined) {
      _board[row][col].state = -1;
      return false;
    }
    _board[row][col].state = 1;
    _board[row][col].ship.hit();
    return true;
  };

  const prettyPrint = () => {
    let arr = _board.map((row) => {
      let filteredRow = row.map((cell) => {
        if (cell.state === 1) return 'X';
        if (cell.state === -1) return 'O';
        if (cell.state === 0 && cell.ship) return cell.ship.size;
        return ' ';
      });
      return filteredRow;
    });
    console.table(arr);
    return arr;
  };

  return {
    placeShip,
    receiveAttack,
    prettyPrint,
    get size() {
      return _size;
    },
    get board() {
      return _board;
    },
  };
};

module.exports = Gameboard;
