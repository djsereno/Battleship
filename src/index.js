const Ship = (length) => {
  const size = length;
  let damage = 0;
  let alive = true;

  const hit = () => {
    // Returns true if the hit sinks the ship
    if (!alive) return undefined;
    damage += 1;
    if (damage === size) alive = false;
    return !alive;
  };

  const isSunk = () => alive;

  return {
    size,
    damage,
    hit,
    isSunk,
  };
};

const carrier = Ship(5);
carrier.hit();
