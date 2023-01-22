import { SET_NOTES_LIST } from "apis/Actions/types";

const initialState = {
  allNotes: [],
  note: {},
};

const setAllNotes = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTES_LIST:
      return {
        ...state,
        allNotes: action.payload,
      };

    default:
      return state;
  }
};

export default setAllNotes;
