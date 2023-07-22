import Player from '../player';
import { SHIP_KEYS } from '../globals';

for (let i = 0; i < 10; i += 1) {
  describe(`Test randopm player ${i}:`, () => {
    const player = Player();
    test('Player isAI to be true', () => {
      expect(player.isAI).toBeTruthy();
    });
    test('Player has a defined gameboard', () => {
      expect(player.board).toBeDefined();
    });

    player.initBoard();
    describe.each(SHIP_KEYS)('All ships are placed:', (ship) => {
      test(`${ship} is defined`, () => {
        expect(player.board.ships[ship]).toBeDefined();
      });
    });
    player.board.prettyPrint(`Player 1-${i}:`);
  });
}
