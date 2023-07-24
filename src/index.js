import './normalize.css';
import './styles.css';
import Player from './player';

(() => {
  const BOARD_SIZE = 10;
  const player1 = Player('Player 1', true, BOARD_SIZE);
  const player2 = Player('Player 2', true, BOARD_SIZE);
  const player1Heading = document.querySelector('#player-1>h2');
  const player2Heading = document.querySelector('#player-2>h2');
  let attacker = player1;
  let defender = player2;

  player1.initBoard();
  player2.initBoard();

  const getCellCoord = (target) => {
    if (!target.classList.contains('grid-cell')) return undefined;
    const row = target.getAttribute('data-row');
    const col = target.getAttribute('data-col');
    return [row, col];
  };

  const changeTurn = () => {
    [attacker, defender] = [defender, attacker];
    player1Heading.classList.toggle('current');
    player2Heading.classList.toggle('current');
  };

  const handleAttack = (event, player) => {
    if (player === attacker) return;
    const cell = event.currentTarget;
    const target = getCellCoord(cell);
    const hitShip = player.board.receiveAttack(target);
    if (hitShip === undefined) return;
    if (!hitShip) cell.classList.add('miss');
    if (hitShip) cell.classList.add('hit');
    changeTurn();
  };

  const initGridDOM = (divId, player) => {
    const playerDiv = document.querySelector(divId);
    const grid = playerDiv.querySelector('.grid-container');
    for (let i = 0; i < BOARD_SIZE; i += 1) {
      for (let j = 0; j < BOARD_SIZE; j += 1) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);

        if (player.board.getCell([i, j]).ship)
          cell.innerText = player.board.getCell([i, j]).ship.key;

        cell.addEventListener('click', (e) => handleAttack(e, player));

        grid.appendChild(cell);
      }
    }
  };

  initGridDOM('#player-1', player1);
  initGridDOM('#player-2', player2);
})();
