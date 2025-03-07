import axios from "axios";
import {
    DOCTOR_USER_LOADED,
    DOCTOR_USER_FAILED,
    PATIENT_USER_LOADED,
    PATIENT_USER_FAILED,
    LOGIN_FAILED,
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    REGISTER_DOCTOR_USER_SUCCESS,
    REGISTER_PATIENT_USER_FAILED,
    REGISTER_PATIENT_USER_SUCCESS,
    REGISTER_DOCTOR_USER_FAILED,
    UPDATE_PATIENT_USER_SUCCESS,
    UPDATE_PATIENT_USER_FAILED,
    UPDATE_DOCTOR_USER_FAILED,
    UPDATE_DOCTOR_USER_SUCCESS,
    WS_CONNECT,
    WS_DISCONNECT,
    NEW_MESSAGE,
    GET_CHAT_MESSAGES_SUCCESS,
    WS_CONNECT_SUCCESS,
    WS_CONNECT_FAIL,
    GET_CHAT_MESSAGES_FAIL,
    SEND_MESSAGE_SUCCESS,
    SEND_MESSAGE_FAIL,
    GET_CONSULTATIONS_REQUEST,
    GET_CONSULTATIONS_SUCCESS,
    GET_CONSULTATIONS_FAIL,
    SET_CURRENT_CONSULTATION,
    CLEAR_CHAT,
    GET_STATUSES_REQUEST,
    GET_STATUSES_SUCCESS,
    GET_STATUSES_FAIL,
    CREATE_STATUS_REQUEST,
    CREATE_STATUS_SUCCESS,
    CREATE_STATUS_FAIL
} from "./types";

const API_BASE = "http://127.0.0.1:8000/api";

export const setAuthToken = (token) => async (dispatch) => {
  try {
    const userRes = await axios.get(`${API_BASE}/users/me/`, {
      headers: { Authorization: `Token ${token}` }
    });

    dispatch({ type: 'BASE_USER_LOADED', payload: userRes.data });

    if (userRes.data.is_doctor) {
      await dispatch(getDoctorUser());
    } else if (userRes.data.is_patient) {
      await dispatch(getPatientUser());
    }

    dispatch({ type: 'AUTH_SUCCESS' });
  } catch (error) {
    console.error('Auth validation failed:', error);
    localStorage.removeItem('token');
    dispatch({ type: 'AUTH_FAIL' });
  }
};

// Consolidated get user functions
const fetchUserProfile = (endpoint, successType, failType) => async (dispatch, getState) => {
  try {
    const res = await axios.get(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Token ${getState().auth.token}` }
    });
    dispatch({ type: successType, payload: res.data });
  } catch (error) {
    console.error("API Error:", error.response?.data);
    dispatch({ type: failType });
  }
};
export const getDoctorUser = () => fetchUserProfile('/doctors/me/', DOCTOR_USER_LOADED, DOCTOR_USER_FAILED);
export const getPatientUser = () => fetchUserProfile('/patients/me/', PATIENT_USER_LOADED, PATIENT_USER_FAILED);

// User registration
export const create_doctoruser = (formData) => async (dispatch) => {
    try {
      const res = await axios.post(
        `${API_BASE}/signup/doctor/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' 
          },
          withCredentials: false 
        }
      );
      
      if (res.data.token) {
        axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`;
      }
      
      dispatch({ type: REGISTER_DOCTOR_USER_SUCCESS, payload: res.data });
    } catch (err) {
        handleRegistrationError(err, dispatch, REGISTER_DOCTOR_USER_FAILED);
    }
};

export const create_patientuser = (formData) => async (dispatch) => {
    try {
        const res = await axios.post(`${API_BASE}/signup/patient/`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest' 
          },
          withCredentials: false 
        });
 
        if (res.data.token) {
          axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`;
        }

        dispatch({ type: REGISTER_PATIENT_USER_SUCCESS, payload: res.data });
    } catch (err) {
        handleRegistrationError(err, dispatch, REGISTER_PATIENT_USER_FAILED);
    }
};

// Profile updates
const updateProfile = (endpoint, formData, successType, failType) => async (dispatch, getState) => {
    const token = getState().auth.token;
    if (!token) {
        dispatch({ type: LOGOUT_SUCCESS });
        return Promise.reject("Session expired");
    }

    try {
        const res = await axios.put(`${API_BASE}${endpoint}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Token ${token}`
            }
        });
        dispatch({ type: successType, payload: res.data });
        return res.data;
    } catch (err) {
        console.error("API Error:", err.response?.data);
        dispatch({ type: failType, payload: err.response?.data || 'Update failed' });
        throw err;
    }
};

export const update_doctoruser = (formData) => 
    updateProfile('/doctors/me/', formData, UPDATE_DOCTOR_USER_SUCCESS, UPDATE_DOCTOR_USER_FAILED);

export const update_patientuser = (formData) => 
    updateProfile('/patients/me/', formData, UPDATE_PATIENT_USER_SUCCESS, UPDATE_PATIENT_USER_FAILED);

// Consultations
export const getConsultations = () => async (dispatch, getState) => {
    try {
      const response = await axios.get(`${API_BASE}/consultations/`, {
        headers: { Authorization: `Token ${getState().auth.token}` }
      });
      
      dispatch({
        type: GET_CONSULTATIONS_SUCCESS,
        payload: response.data 
      });
    } catch (error) {
        dispatch({
            type: GET_CONSULTATIONS_FAIL,
            payload: error.response?.data?.detail || "Failed to load consultations"
        });
    }
};


// Messages
export const getChatMessages = (consultationId) => async (dispatch) => {
    try {
      dispatch({ type: 'CHAT_LOADING' });
      
      const response = await axios.get(`/api/consultations/${consultationId}/messages/`);
      
      dispatch({
        type: 'CHAT_MESSAGES_LOADED',
        payload: response.data
      });
      
    } catch (err) {
      dispatch({
        type: 'CHAT_ERROR',
        payload: err.response?.data?.message || 'Error loading messages'
      });
    }
  };

let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 3;

export const connectWebSocket = (consultationId) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;
  const wsProtocol = window.location.protocol === "https:" ? "wss://" : "ws://";

  if (!token || !consultationId) {
    console.error('Missing token/consultation ID');
    return;
  }

  // Close existing connection
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close(1000, 'Switching consultations');  // Normal closure
  }

  // New connection with error handling
  try {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    socket = new WebSocket(`${protocol}://${window.location.host}/ws/chat/${consultationId}/?token=${token}`);



    socket.onopen = () => {
      console.log('WebSocket connected');
      reconnectAttempts = 0; // Reset reconnect attempts on success
      dispatch({ type: WS_CONNECT_SUCCESS });
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      dispatch({ type: WS_CONNECT_FAIL, payload: error.message });
    };

    socket.onclose = (event) => {
      console.log(`WebSocket closed (code: ${event.code}, reason: ${event.reason})`);
      dispatch({ type: WS_DISCONNECT });
      
      if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {  // Only reconnect on abnormal closure
        reconnectAttempts++;
        setTimeout(() => dispatch(connectWebSocket(consultationId)), 2000 * reconnectAttempts);
      }
    };

  } catch (error) {
    console.error('WebSocket init error:', error);
  }
};


export const disconnectWebSocket = () => () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

export const sendMessage = (consultationId, content) => () => {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            content,
            consultation: consultationId,
            timestamp: new Date().toISOString()
        }));
    }
};

// Helper functions
const handleRegistrationResponse = (res, dispatch, successType) => {
    if (!res.data?.token) throw new Error("Invalid server response");
    
    localStorage.setItem('token', res.data.token);
    axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`;
    
    dispatch({
        type: successType,
        payload: {
            token: res.data.token,
            user: res.data.user,
            ...(res.data.doctor && { doctor: res.data.doctor }),
            ...(res.data.patient && { patient: res.data.patient })
        }
    });
};

const handleRegistrationError = (err, dispatch, failType) => {
    console.error("Registration error:", err.response?.data || err.message);
    dispatch({ type: failType });
    throw err;
};

// Authentication
export const login = ({ username, password }) => async (dispatch) => {
    try {
        const res = await axios.post(`${API_BASE}/login/`, { username, password });
        if (!res.data.token) throw new Error("No token received");
        
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common['Authorization'] = `Token ${res.data.token}`;
        dispatch({ type: LOGIN_SUCCESS, payload: res.data });
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        dispatch({ type: LOGIN_FAILED });
    }
};



export const logout = () => async (dispatch) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No token found in localStorage");
        }
        await axios.post(`${API_BASE}/logout/`, null, {
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            }
        });
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        dispatch({ type: LOGOUT_SUCCESS });
    } catch (error) {
        console.error("Logout failed:", error.response?.data || error.message);
    }
};

export const setCurrentConsultation = (consultationId) => ({
    type: SET_CURRENT_CONSULTATION,
    payload: consultationId
});


export const getStatuses = () => async (dispatch, getState) => {
  try {
    dispatch({ type: GET_STATUSES_REQUEST });
    const response = await axios.get(`${API_BASE}/status/`, {
      headers: { Authorization: `Token ${getState().auth.token}` },
    });
    dispatch({
      type: GET_STATUSES_SUCCESS,
      payload: response.data.results || response.data,
    });
  } catch (error) {
    dispatch({
      type: GET_STATUSES_FAIL,
      payload: error.response?.data?.detail || 'Error loading statuses',
    });
  }
};

export const createStatus = (formData) => async (dispatch, getState) => {
  try {
    dispatch({ type: CREATE_STATUS_REQUEST });
    const data = new FormData();
    data.append('status_type', formData.status_type);
    if (formData.status_type === 'text') {
      data.append('status_text', formData.status_text);
      data.append('background_color', formData.background_color);
    } else if (formData.status_type === 'image') {
      data.append('caption', formData.caption);
      data.append('status_image', formData.status_image);
    } else if (formData.status_type === 'video') {
      data.append('caption', formData.caption);
      data.append('status_video', formData.status_video);
    }
    const response = await axios.post(`${API_BASE}/status/`, data, {
      headers: {
        Authorization: `Token ${getState().auth.token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    dispatch({
      type: CREATE_STATUS_SUCCESS,
      payload: response.data,
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: CREATE_STATUS_FAIL,
      payload: error.response?.data || { detail: 'Failed to create status' },
    });
    throw error;
  }
};
