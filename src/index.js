import './normalize.css';
import './styles.css';
import Player from './player';
import DOMControl from './domcontrol';
import StateMachine from './statemachine';

(() => {
  const BOARD_SIZE = 10;
  let player1 = Player('Player 1', false, BOARD_SIZE);
  let player2 = Player('Player 2', true, BOARD_SIZE);
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

  const endGame = () => {
    domControl.updateStatus(`${attacker.name} wins!`);
    domControl.toggleNewGameBtn();
  };

  const handleAttack = (targetCoords, player) => {
    if (!stateMachine.isGameActive()) return;

    const hitShip = player.board.receiveAttack(targetCoords);
    if (hitShip === undefined) return;
    domControl.addHitOrMissStyle(targetCoords, player, hitShip);

    const gameIsOver = checkGameOver();
    if (gameIsOver) {
      stateMachine.updateState();
      endGame();
    } else {
      changeTurn(); // eslint-disable-line no-use-before-define
    }
  };

  const changeTurn = () => {
    [attacker, defender] = [defender, attacker];
    domControl.updateAttacker(attacker);
    if (attacker.isAI) handleAttack(attacker.getTarget(), defender);
  };

  const startNewGame = () => {
    stateMachine.startNewGame();
    player1 = Player('Player 1', false, BOARD_SIZE);
    player2 = Player('Player 2', true, BOARD_SIZE);
    attacker = player1;
    defender = player2;
    player2.initBoard();
    domControl.toggleNewGameBtn();
    domControl.resetGame(player1, player2);
    domControl.updateGridDOM(player2);
    domControl.updateStatus(`${attacker.name}'s turn`);
    stateMachine.updateState();
  };

  const initGame = () => {
    domControl.initDOM(BOARD_SIZE, startNewGame);
    domControl.initEventHandlers(handleAttack);
    player2.initBoard();
    domControl.updateGridDOM(player2);
    domControl.updateStatus(`${attacker.name}'s turn`);
    stateMachine.updateState();
  };

  initGame();
})();
