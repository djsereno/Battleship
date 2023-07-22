import Gameboard from './gameboard';
import { SHIP_KEYS } from './globals';

function randomInt(int) {
  return Math.floor(Math.random() * int);
}

const Player = (ai = true) => {
  const isAI = ai;
  const gameboard = Gameboard();

  const initBoard = () => {
    if (isAI) {
      SHIP_KEYS.forEach((ship) => {
        let valid = false;
        do {
          const row = randomInt(10);
          const col = randomInt(10);
          const dir = ['H', 'V'][randomInt(2)];
          valid = gameboard.placeShip(ship, [row, col], dir);
        } while (!valid);
      });
    }
  };

  return {
    initBoard,
    get isAI() {
      return isAI;
    },
    get board() {
      return gameboard;
    },
  };
};

export default Player;
