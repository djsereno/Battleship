const Ship = (name) => {
  const SHIPS = {
    CAR: 5,
    BAT: 4,
    CRU: 3,
    SUB: 3,
    DES: 2,
  };
  const _size = SHIPS[name];
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
