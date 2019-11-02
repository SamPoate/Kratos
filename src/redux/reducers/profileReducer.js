import { UPDATE_MAX_REPS } from '../actions/types';

const initialState = {
  squat: 0,
  bench: 0,
  deadLift: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MAX_REPS:
      return {
        ...state,
        squat: action.payload.squat,
        bench: action.payload.bench,
        deadLift: action.payload.deadLift
      };

    default:
      return state;
  }
}
