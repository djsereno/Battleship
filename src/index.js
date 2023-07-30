import './normalize.css';
import './styles.css';
import Player from './player';
import DOMControl from './domcontrol';
import StateMachine from './statemachine';

(() => {
  const BOARD_SIZE = 10;
  const player1 = Player('Player 1', false, BOARD_SIZE);
  const player2 = Player('Player 2', true, BOARD_SIZE);
  let attacker = player1;
  let defender = player2;
  const stateMachine = StateMachine();
  const domControl = DOMControl(player1, player2, stateMachine);

  const checkGameOver = () => {
    let winner;
    if (!player1.isAlive()) winner = player2;
    if (!player2.isAlive()) winner = player1;
    if (winner === undefined) return false;
    return true;
  };

  const changeTurn = () => {
    [attacker, defender] = [defender, attacker];
    domControl.updateAttacker(attacker);
    if (attacker.isAI) handleAITurn();
  };

  const handleAttack = (event, player) => {
    if (!stateMachine.isGameActive() || player === attacker) return;

    const target = domControl.getCellCoord(event.currentTarget);
    const hitShip = player.board.receiveAttack(target);
    if (hitShip === undefined) return;
    domControl.updateCellStyle(target, defender, hitShip);

    const gameIsOver = checkGameOver();
    if (!gameIsOver) changeTurn();
    if (gameIsOver) {
      stateMachine.updateState();
      endGame();
    }
  };

  const handleAITurn = () => {
    if (!stateMachine.isGameActive()) return;

    const target = attacker.getTarget();
    const hitShip = defender.board.receiveAttack(target);
    if (hitShip === undefined) return;
    domControl.updateCellStyle(target, defender, hitShip);

    const gameIsOver = checkGameOver();
    if (!gameIsOver) changeTurn();
    if (gameIsOver) {
      stateMachine.updateState();
      endGame();
    }
  };

  const endGame = () => {
    domControl.updateStatus(`${attacker.name} wins!`);
  };

  const initGame = () => {
    domControl.initGridDOMs(BOARD_SIZE);
    domControl.initEventHandlers(handleAttack);
    player2.initBoard();
    domControl.updateGridDOM(player2);
    domControl.updateStatus(`${attacker.name}'s turn`);
    stateMachine.updateState();
  };

  initGame();
})();
