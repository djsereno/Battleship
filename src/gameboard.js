const Gameboard = (size) => {
  const _size = size;
  const _board = Array(_size)
    .fill(0)
    .map((row) => Array(_size).fill(0));

  const checkPlacement = (size, startCoord, direction) => {
    let [row, col] = startCoord;
    for (let i = 0; i < size; i++) {
      if (row < 0 || row >= _size || col < 0 || col >= _size) return false;
      if (_board[row][col]) return false;
      direction === 'H' ? col++ : row++;
    }
    return true;
  };

  const placeShip = (size, startCoord, direction) => {
    if (!checkPlacement(size, startCoord, direction)) return false;
    let [row, col] = startCoord;
    for (let i = 0; i < size; i++) {
      _board[row][col] = size;
      direction === 'H' ? col++ : row++;
    }
    return true;
  };

  return {
    placeShip,
    get size() {
      return _size;
    },
    get board() {
      return _board;
    },
  };
};

module.exports = Gameboard;
