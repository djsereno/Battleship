import { SHIP_KEYS, SHIP_SIZES } from './globals';

const DOMControl = (playerOne, playerTwo, stateMachine) => {
  const player1Grid = document.querySelector('#player-1 .grid-container');
  const player2Grid = document.querySelector('#player-2 .grid-container');
  const player1Heading = document.querySelector('#player-1 h2');
  const player2Heading = document.querySelector('#player-1 h2');
  const statusMessage = document.querySelector('#status-message');
  const newGameButton = document.querySelector('#new-game-btn');

  let shipKey;
  let size;
  let direction;
  let player1 = playerOne;
  let player2 = playerTwo;

  const initPlaceShipVars = () => {
    [shipKey] = SHIP_KEYS;
    size = SHIP_SIZES[shipKey];
    direction = 'H';
  };

  const getCellDOM = (coord, player) => {
    const [row, col] = coord;
    const container = player === player1 ? player1Grid : player2Grid;
    const cellDOM = container.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    return cellDOM;
  };

  const getCellCoord = (target) => {
    if (!target.classList.contains('grid-cell')) return undefined;
    const row = +target.getAttribute('data-row');
    const col = +target.getAttribute('data-col');
    return [row, col];
  };

  const updateStatus = (message) => {
    statusMessage.innerText = message;
  };

  const updateAttacker = (newAttacker) => {
    player1Heading.classList.toggle('current');
    player2Heading.classList.toggle('current');
    updateStatus(`${newAttacker.name}'s turn`);
  };

  const initDOM = (boardSize, startNewGame) => {
    document.documentElement.style.setProperty('--board-size', boardSize);
    document.querySelector('body').addEventListener('contextmenu', (e) => e.preventDefault());
    newGameButton.addEventListener('click', startNewGame);

    [player1Grid, player2Grid].forEach((gridDOM) => {
      for (let i = 0; i < boardSize; i += 1) {
        for (let j = 0; j < boardSize; j += 1) {
          const cell = document.createElement('button');
          cell.classList.add('grid-cell');
          cell.setAttribute('data-row', i);
          cell.setAttribute('data-col', j);

          const topLeftCrosshair = document.createElement('span');
          topLeftCrosshair.classList.add('crosshair', 'top-left');
          cell.appendChild(topLeftCrosshair);

          if (j === boardSize - 1) {
            const topRightCrosshair = document.createElement('span');
            topRightCrosshair.classList.add('crosshair', 'top-right');
            cell.appendChild(topRightCrosshair);
          }
          if (i === boardSize - 1) {
            const botLeftCrosshair = document.createElement('span');
            botLeftCrosshair.classList.add('crosshair', 'bot-left');
            cell.appendChild(botLeftCrosshair);
          }
          if (i === boardSize - 1 && j === boardSize - 1) {
            const botRightCrosshair = document.createElement('span');
            botRightCrosshair.classList.add('crosshair', 'bot-right');
            cell.appendChild(botRightCrosshair);
          }
          gridDOM.appendChild(cell);
        }
      }
    });
  };

  const updateGridDOM = (player) => {
    const gridDOM = player === player1 ? player1Grid : player2Grid;
    gridDOM.childNodes.forEach((cellDOM) => {
      const coord = getCellCoord(cellDOM);
      if (player.board.getCell(coord).ship) {
        // cellDOM.innerText = player.board.getCell(coord).ship.key;
        cellDOM.classList.add('ship');
      }
    });
  };

  const clearPreview = () => {
    if (!stateMachine.isSetupActive()) return;

    const cells = player1Grid.querySelectorAll('.preview');
    cells.forEach((cell) => cell.classList.remove('preview', 'valid', 'invalid'));
  };

  const resetGame = (newPlayer1, newPlayer2) => {
    [player1, player2] = [newPlayer1, newPlayer2];
    const cells = document.querySelectorAll('.grid-cell');
    cells.forEach((cell) => {
      cell.classList.remove('ship', 'miss', 'hit');
      // cell.innerText = '';
    });
    initPlaceShipVars();
  };

  const addHitOrMissStyle = (targetCoords, defender, hitShip) => {
    const cell = getCellDOM(targetCoords, defender);
    if (!hitShip) cell.classList.add('miss');
    if (hitShip) cell.classList.add('hit');
  };

  const previewShipPlacement = (event) => {
    if (!stateMachine.isSetupActive()) return;

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
    if (!stateMachine.isSetupActive()) return;

    direction = direction === 'H' ? 'V' : 'H';
    previewShipPlacement(event);
  };

  const placeShip = (event) => {
    if (!stateMachine.isSetupActive()) return;

    const target = event.currentTarget;
    const coord = getCellCoord(target);
    const valid = player1.board.placeShip(shipKey, coord, direction);
    if (!valid) return;

    updateGridDOM(player1);

    if (shipKey === SHIP_KEYS.slice(-1)[0]) {
      clearPreview();
      stateMachine.updateState();
    }
    shipKey = SHIP_KEYS[SHIP_KEYS.indexOf(shipKey) + 1];
    size = SHIP_SIZES[shipKey];
  };

  const initEventHandlers = (handleAttack) => {
    player1Grid.addEventListener('mouseleave', clearPreview);
    player1Grid.childNodes.forEach((cell) => {
      cell.addEventListener('mouseover', previewShipPlacement);
      cell.addEventListener('contextmenu', rotateShip);
      cell.addEventListener('click', placeShip);
    });
    player2Grid.childNodes.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        const targetCoords = getCellCoord(e.currentTarget);
        handleAttack(targetCoords, player2);
      });
    });
  };

  const toggleNewGameBtn = () => {
    newGameButton.classList.toggle('hidden');
  };

  initPlaceShipVars();

  return {
    initDOM,
    initEventHandlers,
    toggleNewGameBtn,
    updateGridDOM,
    updateStatus,
    updateAttacker,
    getCellCoord,
    addHitOrMissStyle,
    resetGame,
  };
};

export default DOMControl;
