import Gameboard from './gameboard';

const Player = (ai = true, gameSize = 10) => {
  const isAI = ai;
  const gameboard = Gameboard(gameSize);

  return {
    get isAI() {
      return isAI;
    },
    get board() {
      return gameboard;
    },
  };
};

export default Player;
