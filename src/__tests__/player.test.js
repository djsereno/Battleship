import Player from '../player';
import { SHIP_KEYS, SHIP_SIZES } from '../globals';

for (let i = 0; i < 1; i += 1) {
  const player1 = Player('Player 1');
  const player2 = Player('Player 2', false);
  const { size } = player1.board;

  describe('Initialize players:', () => {
    test(`${i}: name/isAI/board/isAlive: Player 1 is AI and has gameboard`, () => {
      expect(player1.name).toBe('Player 1');
      expect(player1.isAI).toBeTruthy();
      expect(player1.board).toBeDefined();
      expect(player1.isAlive()).toBeTruthy();
    });
    test(`${i}: name/isAI/board/isAlive: Player 2 is human and has gameboard`, () => {
      expect(player2.name).toBe('Player 2');
      expect(player2.isAI).toBeFalsy();
      expect(player2.board).toBeDefined();
      expect(player2.isAlive()).toBeTruthy();
    });
  });

  describe('Setup boards and check target acquisition:', () => {
    beforeAll(() => {
      player1.initBoard();
      player2.initBoard();
    });

    test(`${i}: initBoard: All ships are properly placed`, () => {
      const shipSizeTotal = Object.values(SHIP_SIZES).reduce((a, b) => a + b, 0);
      const ships = Object.fromEntries(SHIP_KEYS.map((ship) => [ship, 0]));
      let empties = 0;

      player1.board.array.forEach((row) =>
        row.forEach((cell) => {
          if (cell.ship) ships[cell.ship.key] += 1;
          if (!cell.ship) empties += 1;
        }),
      );
      expect(ships).toEqual(SHIP_SIZES);
      expect(empties).toBe(size * size - shipSizeTotal);
    });

    test(`${i}: getTarget: Target is defined and attack was received`, () => {
      for (let j = 0; j < size * size; j += 1) {
        const target = player1.getTarget();
        const attackResult = player2.board.receiveAttack(target);
        expect(target).toBeDefined();
        expect(attackResult).toBeDefined();
      }
    });
    test(`${i}: isAlive: Player is not alive after firing all possible shots`, () => {
      expect(player2.isAlive()).toBe(false);
    });
  });
}
