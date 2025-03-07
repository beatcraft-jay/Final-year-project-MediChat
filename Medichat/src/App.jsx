import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { DoctorPrivateRoute, PatientPrivateRoute } from "./private/PrivateRoute"
import './App.css';
import PatientHome from './pages/PatientHome';
import Login from './pages/Login';
import Signin from './pages/Signin';
import DoctorSignin from './pages/DoctorSignin';
import PatientRegister from './pages/PatientRegister';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthToken } from './actions/auth';
import DoctorRegister from './pages/DoctorRegister';
import DoctorHome from './pages/DoctorHome';
import Chat from './components/Chat';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setAuthToken(token));
    }
  }, [dispatch]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup/patient" element={<Signin />} />
        <Route path="/signup/doctor" element={<DoctorSignin />} />
        <Route
          path="/patient/register"
          element={
            <PatientPrivateRoute>
              <PatientRegister />
            </PatientPrivateRoute>
          }
        />
        <Route
          path="/doctor/register"
          element={
            <DoctorPrivateRoute>
              <DoctorRegister />
            </DoctorPrivateRoute>
          }
        />
        <Route
          path="/patient/app/*"
          element={
            <PatientPrivateRoute isAuthenticated={true}>
              <PatientHome />
            </PatientPrivateRoute>
          }
        >
          <Route path="chat/:consultationId" element={<Chat/>} />
        </Route>
        <Route
          path="/doctor/app"
          element={
            <DoctorPrivateRoute isAuthenticated={true}>
              <DoctorHome />
            </DoctorPrivateRoute>
          }
        >
        <Route path="chat/:consultationId" element={<Chat/>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;