import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const DoctorPrivateRoute = ({ children }) => {
  const { token, isDoctor } = useSelector(state => state.auth);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return isDoctor ? children : <Navigate to="/" replace />;
};

export const PatientPrivateRoute = ({ children }) => {
  const { token, isDoctor } = useSelector(state => state.auth);
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return !isDoctor ? children : <Navigate to="/" replace />;
};