import { SHIP_SIZES } from './globals';

const Ship = (name) => {
  if (!(name in SHIP_SIZES)) return false;
  const size = SHIP_SIZES[name];
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
