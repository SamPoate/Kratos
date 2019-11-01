import { ADD_TO_CHARACTER, REMOVE_FROM_CHARACTER } from '../actions/types';

const initialState = {
  items: [],
  slots: 7
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ADD_TO_CHARACTER:
      return {
        ...state,
        items: [...state.items, action.payload]
      };

    case REMOVE_FROM_CHARACTER:
      return {
        ...state,
        items: action.payload
      };

    default:
      return state;
  }
}
