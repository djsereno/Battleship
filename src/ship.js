const Ship = (size) => {
  const _size = size;
  let _damage = 0;

  const isSunk = () => _damage === _size;
  const hit = () => {
    if (isSunk()) return undefined;
    _damage += 1;
    return isSunk();
  };

  return {
    hit,
    isSunk,
    get size() {
      return _size;
    },
    get damage() {
      return _damage;
    },
  };
};

module.exports = Ship;
