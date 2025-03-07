import {
    GET_CONSULTATIONS_REQUEST,
    GET_CONSULTATIONS_SUCCESS,
    GET_CONSULTATIONS_FAIL,
    SET_CURRENT_CONSULTATION,
  } from "../actions/types";
  
  const initialState = {
    data: {
      count: 0,
      next: null,
      previous: null,
      results: []
    },
    current: null,
    loading: false,
    error: null
  };
  
  export default function consultationsReducer(state = initialState, action) {
    switch (action.type) {
      case GET_CONSULTATIONS_REQUEST:
        return { ...state, loading: true, error: null };
  
      case GET_CONSULTATIONS_SUCCESS:
        return { 
          ...state, 
          data: action.payload,
          loading: false 
        };
  
      case GET_CONSULTATIONS_FAIL:
        return { 
          ...state, 
          loading: false,
          error: action.payload || "Failed to fetch consultations"
        };
  
        case SET_CURRENT_CONSULTATION:
          return {
            ...state,
            current: state.data.results.find(c => c.id === action.payload) || null,
          };
  
      default:
        return state;
    }
  }
  