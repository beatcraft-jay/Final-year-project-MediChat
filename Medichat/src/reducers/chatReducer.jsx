import {
  CLEAR_CHAT,
  GET_CHAT_MESSAGES_SUCCESS,
  GET_CHAT_MESSAGES_FAIL,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAIL,
} from "../actions/types";

const initialState = {
  connected: false,
  messages: [],
  loading: true,
  error: null,
  sending: false,
};

export default function chatReducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_CHAT:
      return initialState;

    case GET_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.payload, // Ensure payload is an array
        loading: false,
        error: null,
      };

    case GET_CHAT_MESSAGES_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload || "Failed to fetch messages",
      };

    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        sending: true,
      };

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messages: [...state.messages, action.payload], // Append new message
        sending: false,
      };

    case SEND_MESSAGE_FAIL:
      return {
        ...state,
        sending: false,
        error: action.payload || "Message send failed",
      };

    case 'WS_CONNECT_SUCCESS':
      return { ...state, connected: true };

    case 'WS_DISCONNECT':
    case 'WS_CONNECT_FAIL':
      return { ...state, connected: false };

    default:
      return state;
  }
}
