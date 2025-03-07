import React, { useEffect, useState } from 'react';

function Contacts(props) {
  return (
    <div className="contacts-container">
      {/* Enhanced Search Bar */}
      <div className="input-group my-3 px-3 search-wrapper">
        <input
          type="text"
          className="form-control border-0 bg-light shadow-sm"
          placeholder="Search contacts..."
          aria-label="Search"
        />
        <button
          className="btn btn-outline-secondary border-0 bg-light shadow-sm search-btn"
          type="button"
          id="button-addon2"
        >
          <i className="bi bi-search"></i>
        </button>
      </div>

      {/* Contacts List */}
      <div className="contacts-box shadow-lg rounded-3">
        <ul className="list-unstyled mb-0">
          <li className="p-3 border-bottom contact-item">
            <a href="#!" className="d-flex justify-content-between align-items-center text-decoration-none">
              <div className="d-flex flex-row align-items-center">
                <div className="position-relative">
                  <img
                    className="user-img-massage rounded-circle"
                    src="assets/img/user2.jpg"
                    alt="Dr. Tumusiime Benon"
                  />
                  <span className="badge bg-success badge-dot">2</span>
                </div>
                <div className="pt-1 mx-3">
                  <p className="mb-0 text-success main-text fw-bold">Dr. Tumusiime Benon</p>
                  <p className="small text-muted mb-0">Surgeon at Nsambya Hospital</p>
                </div>
              </div>
              <div className="pt-1 contact-action">
                <i className="bi bi-telephone fs-5 text-primary"></i>
              </div>
            </a>
          </li><li className="p-3 border-bottom contact-item">
            <a href="#!" className="d-flex justify-content-between align-items-center text-decoration-none">
              <div className="d-flex flex-row align-items-center">
                <div className="position-relative">
                  <img
                    className="user-img-massage rounded-circle"
                    src="assets/img/user2.jpg"
                    alt="Dr. Tumusiime Benon"
                  />
                  <span className="badge bg-danger badge-dot">3</span>
                </div>
                <div className="pt-1 mx-3">
                  <p className="mb-0 text-success main-text fw-bold">Dr. Dupa Geofrey</p>
                  <p className="small text-muted mb-0">Cardiologist at Mulago Hospital</p>
                </div>
              </div>
              <div className="pt-1 contact-action">
                <i className="bi bi-telephone fs-5 text-primary"></i>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Contacts;