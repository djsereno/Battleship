const Ship = require('./ship');

const Gameboard = (dimension) => {
  const size = dimension;
  const ships = {
    CAR: undefined,
    BAT: undefined,
    CRU: undefined,
    SUB: undefined,
    DES: undefined,
  };
  const board = Array(size)
    .fill()
    .map(() =>
      Array(size)
        .fill()
        .map(() => ({ state: 0 })),
    );

  const checkValidCell = (coord) => {
    const [row, col] = coord;
    return row >= 0 && row < size && col >= 0 && col < size;
  };

  const checkValidShip = (length, startCoord, direction) => {
    let [row, col] = startCoord;
    for (let i = 0; i < length; i += 1) {
      if (!checkValidCell([row, col]) || board[row][col].ship) return false;
      if (direction === 'H') col += 1;
      if (direction === 'V') row += 1;
    }
    return true;
  };

  const placeShip = (name, startCoord, direction) => {
    const ship = Ship(name);
    const length = ship.size;
    if (!checkValidShip(length, startCoord, direction)) return false;

    let [row, col] = startCoord;
    for (let i = 0; i < length; i += 1) {
      board[row][col] = { state: 0, ship };
      if (direction === 'H') col += 1;
      if (direction === 'V') row += 1;
    }
    ships[name] = ship;
    return true;
  };

  const receiveAttack = (coord) => {
    if (!checkValidCell(coord)) return undefined;
    const [row, col] = coord;
    const cell = board[row][col];
    if (cell.ship === undefined) {
      cell.state = -1;
      return false;
    }
    cell.state = 1;
    cell.ship.hit();
    return true;
  };

  const prettyPrint = () => {
    const arr = board.map((row) => {
      const filteredRow = row.map((cell) => {
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
      return size;
    },
    get board() {
      return board;
    },
    get ships() {
      return ships;
    },
  };
};

module.exports = Gameboard;
