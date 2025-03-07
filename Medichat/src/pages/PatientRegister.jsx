import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPatientUser, update_patientuser } from '../actions/auth';

const PatientRegister = ({ update_patientuser}) => {
  const navigate = useNavigate();
  const patientId = useSelector((state) => state.auth.patientId);
  const [redirect, setRedirect] = useState(false);

  const [registered_patient, setRegisteredPatient] = useState({
    title: '',
    first_name: '',
    last_name: '',
    profile_image: '',
    date_of_birth: '',
    phone_number: '',
    medical_history: '',
  });

  const handleFileChange = (e) => {
    setRegisteredPatient({ ...registered_patient, profile_image: e.target.files[0] });
  };

  const handleChange = (e) =>
    setRegisteredPatient({
      ...registered_patient,
      [e.target.name]: e.target.value,
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const formData = new FormData();
      for (const key in registered_patient) {
          if (registered_patient[key] !== null && registered_patient[key] !== undefined) {
              formData.append(key, registered_patient[key]);
          }
      }
  
      update_patientuser(formData)
          .then(() => {
              navigate('/patient/app'); 
          })
          .catch((error) => {
              console.error('Update failed:', error);
              alert(`Update failed: ${error.response?.data?.detail || 'Server error'}`);
          });
  };

  const { title, first_name, last_name, date_of_birth, phone_number, medical_history } = registered_patient;

  return (
    <div>
      <Navbar />
      <div className="container-fluid body">
        <div className="row">
          <div className="col left-box">
            <div className="header-text b-4 text-info">
              <h4 className="main-text-srt">Please Register Here</h4>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <select className="fs-6 form-select main-text-srt" onChange={handleChange} name="title" value={title}>
                  <option value="">Title</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Mrs.">Mrs.</option>
                  <option value="Miss.">Miss</option>
                </select>
              </div>
              <div className="mb-3 row input-group">
                <label className="form-label">First and last name</label>
                <input
                  type="text"
                  placeholder="First name"
                  className="fs-6 form-control main-text-srt"
                  onChange={handleChange}
                  name="first_name"
                  value={first_name}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  className="fs-6 form-control main-text-srt"
                  onChange={handleChange}
                  name="last_name"
                  value={last_name}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Date Of Birth</label>
                <input
                  type="date"
                  className="fs-6 form-control main-text-srt"
                  name="date_of_birth"
                  onChange={handleChange}
                  value={date_of_birth}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  placeholder="+256701244244"
                  className="fs-6 form-control main-text-srt"
                  name="phone_number"
                  onChange={handleChange}
                  value={phone_number}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Medical History</label>
                <input
                  type="text"
                  placeholder="High blood pressure, diabetes, ..."
                  className="fs-6 form-control main-text-srt"
                  name="medical_history"
                  onChange={handleChange}
                  value={medical_history}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formFile" className="form-label">
                  Profile Picture
                </label>
                <input className="form-control" type="file" id="formFile" onChange={handleFileChange} />
              </div>
              <div className="input-group mb-3">
                <button className="btn btn-lg btn-primary w-100 fs-6 main-text-srt" type="submit">
                  REGISTER
                </button>
              </div>
            </form>
          </div>
          <div className="col right-box bg">
            
          </div>
        </div>
        <footer className="footer text-center py-2 bg-light">
          <div className="container">
            <div>
              <span className="small-text text-muted">© Copyright Beatcraft 2024</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  isDoctor: state.auth.isDoctor,
});

PatientRegister.propTypes = {
  update_patientuser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  isDoctor: PropTypes.bool,
};

export default connect(mapStateToProps, { update_patientuser })(PatientRegister);
