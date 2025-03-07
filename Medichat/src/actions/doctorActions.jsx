import axios from 'axios';
import {
    DOCTORS_LIST_REQUEST,
    DOCTORS_LIST_SUCCESS,
    DOCTORS_LIST_FAIL
} from "./types";

const API_BASE = "http://127.0.0.1:8000/api";

export const getAllDoctors = () => async (dispatch, getState) => {
  const { token } = getState().auth;
  console.log('Token retrieved:', token);
  if (!token) {
    console.error('No token found, user might be logged out.');
    return;
  }
  const config = {
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    dispatch({ type: DOCTORS_LIST_REQUEST });
    const { data } = await axios.get(`${API_BASE}/doctors/`, config);
    dispatch({
      type: DOCTORS_LIST_SUCCESS,
      payload: data.results || data, // Handle paginated or flat response
    });
  } catch (error) {
    console.error('API request failed:', error.response?.data || error.message);
    dispatch({
      type: DOCTORS_LIST_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};