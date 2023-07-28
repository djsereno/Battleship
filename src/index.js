import './normalize.css';
import './styles.css';
import Player from './player';

(() => {
  const BOARD_SIZE = 10;
  const player1 = Player('Player 1', false, BOARD_SIZE);
  const player2 = Player('Player 2', true, BOARD_SIZE);
  let attacker = player1;
  let defender = player2;

  const player1Grid = document.querySelector('#player-1>.grid-container');
  const player2Grid = document.querySelector('#player-2>.grid-container');
  const player1Heading = document.querySelector('#player-1>h2');
  const player2Heading = document.querySelector('#player-1>h2');
  const statusMessage = document.querySelector('#status-message');

  const updateStatus = (message) => {
    statusMessage.innerText = message;
  };

  const getCellCoord = (target) => {
    if (!target.classList.contains('grid-cell')) return undefined;
    const row = +target.getAttribute('data-row');
    const col = +target.getAttribute('data-col');
    return [row, col];
  };

  const getCellDOM = (coord, player) => {
    const [row, col] = coord;
    const container = player === player1 ? player1Grid : player2Grid;
    const cellDOM = container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    return cellDOM;
  };

  const checkGameOver = () => {
    let winner;
    if (!player1.isAlive()) winner = player2;
    if (!player2.isAlive()) winner = player1;
    if (winner === undefined) return false;
    return true;
  };

  const changeTurn = () => {
    [attacker, defender] = [defender, attacker];
    player1Heading.classList.toggle('current');
    player2Heading.classList.toggle('current');
    updateStatus(`${attacker.name}'s turn`);
    if (attacker.isAI) handleAITurn();
  };

  const handleAttack = (event, player) => {
    if (player === attacker) return;
    const cell = event.currentTarget;
    const target = getCellCoord(cell);
    const hitShip = player.board.receiveAttack(target);
    if (hitShip === undefined) return;
    if (!hitShip) cell.classList.add('miss');
    if (hitShip) cell.classList.add('hit');

    const gameIsOver = checkGameOver();
    if (!gameIsOver) changeTurn();
  };

  const handleAITurn = () => {
    const target = attacker.getTarget();
    const cellDOM = getCellDOM(target, defender);
    const hitShip = defender.board.receiveAttack(target);
    if (hitShip === undefined) return;
    if (!hitShip) cellDOM.classList.add('miss');
    if (hitShip) cellDOM.classList.add('hit');

    const gameIsOver = checkGameOver();
    if (!gameIsOver) changeTurn();
  };

  const initGridDOM = (divId, player) => {
    const playerDiv = document.querySelector(divId);
    const grid = playerDiv.querySelector('.grid-container');
    for (let i = 0; i < BOARD_SIZE; i += 1) {
      for (let j = 0; j < BOARD_SIZE; j += 1) {
        const cell = document.createElement('button');
        cell.classList.add('grid-cell');
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);

        if (player.board.getCell([i, j]).ship)
          cell.innerText = player.board.getCell([i, j]).ship.key;

        grid.appendChild(cell);
      }
    }
  };

  let direction = 'V';
  let size = 5;

  const previewShipPlacement = (event) => {
    const target = event.currentTarget;
    let [row, col] = getCellCoord(target);
    const shipIsValid = player1.board.checkValidShip(size, [row, col], direction);
    const [...oldCells] = player1Grid.querySelectorAll('.preview');

    oldCells.forEach((cell) => cell.classList.remove('preview', 'valid', 'invalid'));

    for (let i = 0; i < size; i += 1) {
      if (!player1.board.checkValidCell([row, col])) break;

      const cell = getCellDOM([row, col], player1);
      if (shipIsValid) {
        cell.classList.remove('invalid');
        cell.classList.add('preview', 'valid');
      } else {
        cell.classList.remove('valid');
        cell.classList.add('preview', 'invalid');
      }

      if (direction === 'H') col += 1;
      if (direction === 'V') row += 1;
    }
  };

  const rotateShip = (event) => {
    event.preventDefault();
    direction = direction === 'H' ? 'V' : 'H';
    previewShipPlacement(event);
  };

  const clearPreview = () => {
    const cells = player1Grid.querySelectorAll('.preview');
    cells.forEach((cell) => cell.classList.remove('preview', 'valid', 'invalid'));
  };

  player2.initBoard();
  initGridDOM('#player-1', player1);
  initGridDOM('#player-2', player2);
  updateStatus(`${attacker.name}'s turn`);

  player1Grid.addEventListener('mouseleave', clearPreview);
  player1Grid.childNodes.forEach((cell) => {
    cell.addEventListener('mouseover', (e) => previewShipPlacement(e));
    cell.addEventListener('contextmenu', (e) => rotateShip(e));
  });
  player2Grid.childNodes.forEach((cell) => {
    cell.addEventListener('click', (e) => handleAttack(e, player2));
  });
})();
