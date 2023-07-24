import { SHIP_SIZES, SHIP_NAMES } from './globals';

const Ship = (shipKey) => {
  if (!(shipKey in SHIP_SIZES)) return false;
  const key = shipKey;
  const name = SHIP_NAMES[key];
  const size = SHIP_SIZES[key];
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
    get key() {
      return key;
    },
    get name() {
      return name;
    },
    get size() {
      return size;
    },
    get damage() {
      return damage;
    },
  };
};

export default Ship;
