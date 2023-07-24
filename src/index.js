import './normalize.css';
import './styles.css';
import Player from './player';

(() => {
  const BOARD_SIZE = 10;
  const player1 = Player('Player 1', true, BOARD_SIZE);
  const player2 = Player('Player 2', true, BOARD_SIZE);
  player1.initBoard();
  player2.initBoard();

  const initGridDOM = (playerDivId) => {
    const playerDiv = document.querySelector(playerDivId);
    const grid = playerDiv.querySelector('.grid-container');
    for (let i = 0; i < BOARD_SIZE; i += 1) {
      for (let j = 0; j < BOARD_SIZE; j += 1) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        grid.appendChild(cell);
      }
    }
  };

  initGridDOM('#player-1');
  initGridDOM('#player-2');
})();
