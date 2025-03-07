import {
    GET_STATUSES_REQUEST,
    GET_STATUSES_SUCCESS,
    GET_STATUSES_FAIL,
    CREATE_STATUS_REQUEST,
    CREATE_STATUS_SUCCESS,
    CREATE_STATUS_FAIL
  } from "../actions/types";
  
  const initialState = {
    statuses: [],
    loading: false,
    error: null
  };
  
  export default function statusReducer(state = initialState, action) {
    switch (action.type) {
      case GET_STATUSES_REQUEST:
      case CREATE_STATUS_REQUEST:
        return { 
          ...state, 
          loading: true, 
          error: null 
        };
      
      case GET_STATUSES_SUCCESS:
        return {
          ...state,
          loading: false,
          statuses: Array.isArray(action.payload) ? action.payload : []
        };
      
      case CREATE_STATUS_SUCCESS:
        return {
          ...state,
          loading: false,
          statuses: [
            action.payload,
            ...(Array.isArray(state.statuses) ? state.statuses : [])
          ]
        };
      
      case GET_STATUSES_FAIL:
      case CREATE_STATUS_FAIL:
        return { 
          ...state, 
          loading: false, 
          error: action.payload 
        };
      
      default:
        return state;
    }
  }