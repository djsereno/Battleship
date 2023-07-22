const SHIPS = {
  CAR: 5,
  BAT: 4,
  CRU: 3,
  SUB: 3,
  DES: 2,
};

const Ship = (name) => {
  if (!(name in SHIPS)) return false;
  const size = SHIPS[name];
  let damage = 0;

  const isSunk = () => damage === size;
  const hit = () => {
    if (isSunk()) return undefined;
    damage += 1;
    return isSunk();
  };

  return {
    hit,
    isSunk,
    get size() {
      return size;
    },
    get damage() {
      return damage;
    },
  };
};

export default Ship;
