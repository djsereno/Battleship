const Ship = (length) => {
  const size = length;
  let damage = 0;

  const isSunk = () => damage === size;
  const hit = () => {
    // Returns true if the hit sinks the ship
    if (isSunk()) return undefined;
    damage += 1;
    return isSunk();
  };

  return {
    hit,
    isSunk,
  };
};

module.exports = Ship;
