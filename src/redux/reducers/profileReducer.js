import { UPDATE_TOTAL_VOLUME } from '../actions/types';

const initialState = {
  totalSquat: 0,
  totalBench: 0,
  totalDeadLift: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TOTAL_VOLUME:
      const type = action.payload.type.toLowerCase();
      const volume = action.payload.volume;

      let newState = {};

      switch (type) {
        case 'squat':
          newState.totalSquat = state.totalSquat + volume;
          break;

        case 'bench':
          newState.totalBench = state.totalBench + volume;
          break;

        case 'deadlift':
          newState.totalDeadLift = state.totalDeadLift + volume;
          break;

        default:
          break;
      }

      return {
        ...state,
        ...newState
      };

    default:
      return state;
  }
}
