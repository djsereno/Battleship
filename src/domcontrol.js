import { SHIP_KEYS, SHIP_SIZES } from './globals';

const DOMControl = (player1, player2, stateMachine) => {
  const player1Grid = document.querySelector('#player-1 .grid-container');
  const player2Grid = document.querySelector('#player-2 .grid-container');
  const player1Heading = document.querySelector('#player-1 h2');
  const player2Heading = document.querySelector('#player-1 h2');
  const statusMessage = document.querySelector('#status-message');

  let shipKey = SHIP_KEYS[0];
  let size = SHIP_SIZES[shipKey];
  let direction = 'H';

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

  const initGridDOMs = (boardSize) => {
    document.querySelector('body').addEventListener('contextmenu', (e) => e.preventDefault());
    document.documentElement.style.setProperty('--board-size', boardSize);
    [player1Grid, player2Grid].forEach((gridDOM) => {
      for (let i = 0; i < boardSize; i += 1) {
        for (let j = 0; j < boardSize; j += 1) {
          const cell = document.createElement('button');
          cell.classList.add('grid-cell');
          cell.setAttribute('data-row', i);
          cell.setAttribute('data-col', j);
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
        cellDOM.innerText = player.board.getCell(coord).ship.key;
        cellDOM.classList.add('ship');
      }
    });
  };

  const clearPreview = () => {
    if (!stateMachine.isSetupActive()) return;

    const cells = player1Grid.querySelectorAll('.preview');
    cells.forEach((cell) => cell.classList.remove('preview', 'valid', 'invalid'));
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

  return {
    initGridDOMs,
    initEventHandlers,
    updateGridDOM,
    updateStatus,
    updateAttacker,
    getCellCoord,
    addHitOrMissStyle,
  };
};

export default DOMControl;
