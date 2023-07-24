import Gameboard from './gameboard';
import { SHIP_KEYS } from './globals';

function randomInt(int) {
  return Math.floor(Math.random() * int);
}

const Player = (playerName, ai = true) => {
  const name = playerName;
  const isAI = ai;
  const gameboard = Gameboard();

  const availableMoves = [];
  for (let i = 0; i < gameboard.size; i += 1) {
    for (let j = 0; j < gameboard.size; j += 1) {
      availableMoves.push([i, j]);
    }
  }

  const getTarget = () => {
    const rand = randomInt(availableMoves.length);
    const [target] = availableMoves.splice(rand, 1);
    return target;
  };

  const isAlive = () => !gameboard.checkGameOver();

  const initBoard = () => {
    SHIP_KEYS.forEach((ship) => {
      let valid = false;
      do {
        const row = randomInt(10);
        const col = randomInt(10);
        const dir = ['H', 'V'][randomInt(2)];
        valid = gameboard.placeShip(ship, [row, col], dir);
      } while (!valid);
    });
  };

  return {
    getTarget,
    initBoard,
    isAlive,
    get name() {
      return name;
    },
    get isAI() {
      return isAI;
    },
    get board() {
      return gameboard;
    },
  };
};

export default Player;
