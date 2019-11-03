import { UPDATE_TOTAL_VOLUME } from '../actions/types';

const initialState = {
  totalSquat: 0,
  totalBench: 0,
  totalDeadLift: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TOTAL_VOLUME:
      const type = action.payload.type;
      const volume = action.payload.volume;

      switch (type) {
        case 'squat':
          return {
            ...state,
            totalSquat: state.totalSquat + volume
          };

        case 'bench':
          return {
            ...state,
            totalBench: state.totalBench + volume
          };

        case 'deadlift':
          return {
            ...state,
            totalDeadLift: state.totalDeadLift + volume
          };

        default:
          return state;
      }

    default:
      return state;
  }
}
