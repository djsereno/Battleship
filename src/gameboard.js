const Gameboard = (size) => {
  const _size = size;
  const _board = Array(size).fill(Array(size).fill(0));

  const checkPlacement = (size, startCoord, direction) => {
    return true;
  };

  return {
    checkPlacement,
    get size() {
      return _size;
    },
    get board() {
      return _board;
    },
  };
};

module.exports = Gameboard;
