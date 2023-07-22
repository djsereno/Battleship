import Player from '../player';

const player1 = Player();
const player2 = Player();

describe('Player 1 tests:', () => {
  test('Player isAI to be true', () => {
    expect(player1.isAI).toBeTruthy();
  });
  test('Player has a gameboard', () => {
    expect(player1.board).toBeTruthy();
  });
  describe.skip(['CAR', 'BAT', 'CRU', 'SUB', 'DES'])(
    'Player ships are placed on board:',
    (ship) => {
      test(`${ship} is defined`, () => {
        expect(player1.gameboard.ships[ship]).toBeUndefined();
      });
    },
  );
  player1.board.prettyPrint('Player 1:');
});

describe('Player 2 tests:', () => {
  test('Player isAI to be true', () => {
    expect(player2.isAI).toBeTruthy();
  });
  test('Player has a gameboard', () => {
    expect(player2.board).toBeTruthy();
  });
  player2.board.prettyPrint('Player 2:');
});
