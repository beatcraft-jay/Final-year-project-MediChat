import {
    DOCTOR_USER_LOADED,
    DOCTOR_USER_FAILED,
    PATIENT_USER_LOADED,
    PATIENT_USER_FAILED,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    LOGOUT_SUCCESS,
    REGISTER_DOCTOR_USER_SUCCESS,
    REGISTER_PATIENT_USER_FAILED,
    REGISTER_PATIENT_USER_SUCCESS,
    REGISTER_DOCTOR_USER_FAILED,
    UPDATE_PATIENT_USER_SUCCESS,
    UPDATE_DOCTOR_USER_SUCCESS,
    UPDATE_DOCTOR_USER_FAILED,
    DOCTORS_LIST_REQUEST,
    DOCTORS_LIST_SUCCESS,
    DOCTORS_LIST_FAIL
} from "../actions/types";

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isDoctor: null,
    isLoading: false,
    user: null,
    patient: null,
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case REGISTER_DOCTOR_USER_SUCCESS:
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                isDoctor: true,
                isLoading: false,
                user: action.payload.user,
                doctor: action.payload.doctor  
            };
            
        case REGISTER_PATIENT_USER_SUCCESS:
            localStorage.setItem('token', action.payload.token); 
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                isDoctor: false,
                isLoading: false,
                user: action.payload.user,
                patient: action.payload.user.patient
            };

        case DOCTOR_USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                isDoctor: true,
                doctor: action.payload,
            };

        case PATIENT_USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                isDoctor: false,
                patient: action.payload,
            };


        case UPDATE_DOCTOR_USER_SUCCESS:
            return {
                ...state,
                doctor: action.payload,
                isLoading: false
            };


        case UPDATE_PATIENT_USER_SUCCESS:
            return {
                ...state,
                patient: action.payload,
                isLoading: false
            };

        case LOGIN_SUCCESS:
            localStorage.setItem("token", action.payload.token);
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                isDoctor: action.payload.user.is_doctor,
                user: action.payload.user,
                patient: action.payload.patient,
            };

        case REGISTER_DOCTOR_USER_FAILED:
        case REGISTER_PATIENT_USER_FAILED:
        case UPDATE_DOCTOR_USER_FAILED:
        case LOGIN_FAILED:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isDoctor: null,
                isAuthenticated: false,
                isLoading: false,
            };

        case DOCTOR_USER_FAILED:
        case PATIENT_USER_FAILED:
        case LOGOUT_SUCCESS:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isDoctor: false,
                isAuthenticated: false,
                isLoading: false,
                user: null,
            };

        case 'SET_AUTH_TOKEN':
            return {
                ...state,
                token: action.payload,
                loading: true,
            };

        case 'USER_LOADED':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
            };

        case 'AUTH_SUCCESS':
            return {
                ...state,
                ...action.payload,
                loading: false,
            };

        case 'AUTH_FAIL':
            return {
                ...state,
                ...action.payload,
                token: null,
                user: null,
                loading: false,
            };

        default:
            return state;
    }
};

