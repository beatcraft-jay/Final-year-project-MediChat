import { configureStore } from '@reduxjs/toolkit';
import rootReducer from "./reducers/rootReducer";
import { thunk } from "redux-thunk"; 

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  });

const token = localStorage.getItem("token") || null;

  const initialState = {
    auth: { token },  
  };

export default store;