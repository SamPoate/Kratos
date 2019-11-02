import { UPDATE_MAX_REPS } from './types';

export const updateMaxReps = data => dispatch => {
  dispatch({
    type: UPDATE_MAX_REPS,
    payload: data
  });
};
