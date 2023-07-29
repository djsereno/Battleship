import './normalize.css';
import './styles.css';
import Player from './player';
import { SHIP_KEYS, SHIP_SIZES } from './globals';

(() => {
  const BOARD_SIZE = 10;
  const GAME_STATES = ['INIT_GAME', 'BOARD_SETUP', 'GAME_ACTIVE', 'GAME_OVER'];
  let gameState = GAME_STATES[0];

  const player1 = Player('Player 1', false, BOARD_SIZE);
  const player2 = Player('Player 2', true, BOARD_SIZE);
  let attacker = player1;
  let defender = player2;

  const player1Grid = document.querySelector('#player-1 .grid-container');
  const player2Grid = document.querySelector('#player-2 .grid-container');
  const player1Heading = document.querySelector('#player-1 h2');
  const player2Heading = document.querySelector('#player-1 h2');
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
    if (gameState !== 'GAME_ACTIVE') return;

    if (player === attacker) return;
    const cell = event.currentTarget;
    const target = getCellCoord(cell);
    const hitShip = player.board.receiveAttack(target);
    if (hitShip === undefined) return;
    if (!hitShip) cell.classList.add('miss');
    if (hitShip) cell.classList.add('hit');

    const gameIsOver = checkGameOver();
    if (!gameIsOver) changeTurn();
    if (gameIsOver) {
      updateGameState();
      endGame();
    }
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

  const endGame = () => {
    updateStatus(`${attacker.name} wins!`);
  };

  const initGridDOM = (gridDOM, player) => {
    for (let i = 0; i < BOARD_SIZE; i += 1) {
      for (let j = 0; j < BOARD_SIZE; j += 1) {
        const cell = document.createElement('button');
        cell.classList.add('grid-cell');
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        gridDOM.appendChild(cell);
      }
    }
  };

  const updateGridDOM = (gridDOM, player) => {
    gridDOM.childNodes.forEach((cellDOM) => {
      const coord = getCellCoord(cellDOM);
      if (player.board.getCell(coord).ship) {
        cellDOM.innerText = player.board.getCell(coord).ship.key;
        cellDOM.classList.add('ship');
      }
    });
  };

  let shipKey = SHIP_KEYS[0];
  let size = SHIP_SIZES[shipKey];
  let direction = 'H';

  const previewShipPlacement = (event) => {
    if (gameState !== 'BOARD_SETUP') return;

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
    if (gameState !== 'BOARD_SETUP') return;

    direction = direction === 'H' ? 'V' : 'H';
    previewShipPlacement(event);
  };

  const placeShip = (event) => {
    if (gameState !== 'BOARD_SETUP') return;

    const target = event.currentTarget;
    const coord = getCellCoord(target);
    const valid = player1.board.placeShip(shipKey, coord, direction);
    if (!valid) return false;

    updateGridDOM(player1Grid, player1);

    if (shipKey === SHIP_KEYS.slice(-1)[0]) {
      updateGameState();
      return;
    }
    shipKey = SHIP_KEYS[SHIP_KEYS.indexOf(shipKey) + 1];
    size = SHIP_SIZES[shipKey];
  };

  const clearPreview = () => {
    const cells = player1Grid.querySelectorAll('.preview');
    cells.forEach((cell) => cell.classList.remove('preview', 'valid', 'invalid'));
  };

  const initGame = () => {
    player2.initBoard();
    updateGridDOM(player2Grid, player2);
    updateStatus(`${attacker.name}'s turn`);

    updateGameState();
  };

  const updateGameState = () => {
    if (gameState === GAME_STATES.slice(-1)[0]) {
      [gameState] = GAME_STATES;
    } else {
      gameState = GAME_STATES[GAME_STATES.indexOf(gameState) + 1];
    }
  };

  document.querySelector('body').addEventListener('contextmenu', (e) => e.preventDefault());
  initGridDOM(player1Grid, player1);
  initGridDOM(player2Grid, player2);
  player1Grid.addEventListener('mouseleave', clearPreview);
  player1Grid.childNodes.forEach((cell) => {
    cell.addEventListener('mouseover', previewShipPlacement);
    cell.addEventListener('contextmenu', rotateShip);
    cell.addEventListener('click', placeShip);
  });
  player2Grid.childNodes.forEach((cell) => {
    cell.addEventListener('click', (e) => handleAttack(e, player2));
  });

  initGame();
})();
