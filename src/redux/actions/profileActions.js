import { UPDATE_TOTAL_VOLUME } from './types';

export const updateTotalVolume = data => dispatch => {
  dispatch({
    type: UPDATE_TOTAL_VOLUME,
    payload: data
  });
};
