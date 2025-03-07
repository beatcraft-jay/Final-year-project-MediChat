import {
  DOCTORS_LIST_REQUEST,
  DOCTORS_LIST_SUCCESS,
  DOCTORS_LIST_FAIL
} from "../actions/types";

const initialState = {
  doctors: [],
  loading: false,
  error: null
};

export const doctorsListReducer = (state = initialState, action) => {
  switch (action.type) {
      case DOCTORS_LIST_REQUEST:
          return { 
              ...state, 
              loading: true,
              error: null 
          };
      case DOCTORS_LIST_SUCCESS:
          return { 
              ...state,
              loading: false,
              doctors: action.payload,
              error: null 
          };
      case DOCTORS_LIST_FAIL:
          return { 
              loading: false,
              doctors: [], 
              error: action.payload
          };
      default:
          return state;
  }
};
