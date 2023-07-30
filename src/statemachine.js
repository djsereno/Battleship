const StateMachine = () => {
  const GAME_STATES = ['INIT_GAME', 'BOARD_SETUP', 'GAME_ACTIVE', 'GAME_OVER'];
  let currentState = GAME_STATES[0];

  const updateState = () => {
    const newState =
      currentState === GAME_STATES.slice(-1)[0]
        ? GAME_STATES[0]
        : GAME_STATES[GAME_STATES.indexOf(currentState) + 1];
    console.log(`${currentState} -> ${newState}`);
    currentState = newState;
    return newState;
  };

  const isSetupActive = () => currentState === 'BOARD_SETUP';
  const isGameActive = () => currentState === 'GAME_ACTIVE';

  return {
    updateState,
    isSetupActive,
    isGameActive,
    get state() {
      return currentState;
    },
  };
};

export default StateMachine;
