import { ADD_TO_CHARACTER } from './types';

export const addToCharacter = item => dispatch => {
  dispatch({
    type: ADD_TO_CHARACTER,
    payload: item.id
  });
};
