import Ship from './ship';
import { SHIP_KEYS } from './globals';

const Gameboard = (dimension = 10) => {
  const size = dimension;
  const ships = Object.fromEntries(SHIP_KEYS.map((ship) => [ship, Ship(ship)]));
  const array = Array(size)
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
      if (!checkValidCell([row, col]) || array[row][col].ship) return false;
      if (direction === 'H') col += 1;
      if (direction === 'V') row += 1;
    }
    return true;
  };

  const placeShip = (name, startCoord, direction) => {
    const ship = ships[name];
    const length = ship.size;
    if (!checkValidShip(length, startCoord, direction)) return false;

    let [row, col] = startCoord;
    for (let i = 0; i < length; i += 1) {
      array[row][col] = { state: 0, ship };
      if (direction === 'H') col += 1;
      if (direction === 'V') row += 1;
    }
    return true;
  };

  const receiveAttack = (coord) => {
    if (!checkValidCell(coord)) return undefined;
    const [row, col] = coord;
    const cell = array[row][col];
    if (cell.state !== 0) return undefined;
    if (cell.ship === undefined) {
      cell.state = -1;
      return false;
    }
    cell.state = 1;
    cell.ship.hit();
    return true;
  };

  const getCell = ([row, col]) => array[row][col];

  const checkGameOver = () => {
    let gameOver = true;
    SHIP_KEYS.forEach((ship) => {
      if (!ships[ship].isSunk()) gameOver = false;
    });
    return gameOver;
  };

  const prettyPrint = (title = '') => {
    const arr = array.map((row) => {
      const filteredRow = row.map((cell) => {
        if (cell.state === 1) return '✔';
        if (cell.state === -1) return 'x';
        if (cell.state === 0 && cell.ship) return cell.ship.size;
        return '_';
      });
      return filteredRow;
    });

    let str = title === '' ? '' : `${title}\n`; // title
    str += `_|${[...Array(size).keys()].join('|')}\n`; // column indexes
    str += arr.map((row, i) => `${i}|${row.join('|')}`).join('\n'); // rest of table
    console.log(str); // eslint-disable-line
    return str;
  };

  return {
    placeShip,
    receiveAttack,
    getCell,
    prettyPrint,
    checkGameOver,
    get size() {
      return size;
    },
    get array() {
      return array;
    },
    get ships() {
      return ships;
    },
  };
};

export default Gameboard;
