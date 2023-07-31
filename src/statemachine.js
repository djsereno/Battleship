const StateMachine = () => {
  const GAME_STATES = ['INIT_GAME', 'BOARD_SETUP', 'GAME_ACTIVE', 'GAME_OVER'];
  let [currentState] = GAME_STATES;

  const updateState = () => {
    const newState =
      currentState === GAME_STATES.slice(-1)[0]
        ? GAME_STATES[0]
        : GAME_STATES[GAME_STATES.indexOf(currentState) + 1];
    currentState = newState;
    return newState;
  };

  const isSetupActive = () => currentState === 'BOARD_SETUP';
  const isGameActive = () => currentState === 'GAME_ACTIVE';
  const startNewGame = () => {
    [currentState] = GAME_STATES;
  };

  return {
    updateState,
    isSetupActive,
    isGameActive,
    startNewGame,
    get state() {
      return currentState;
    },
  };
};

export default StateMachine;
