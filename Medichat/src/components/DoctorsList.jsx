import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDoctors } from '../actions/doctorActions';

const DoctorsList = () => {
  const dispatch = useDispatch();
  const doctorsList = useSelector((state) => state.doctorsList);
  const { doctors, loading, error } = doctorsList || {};

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const specialties = [
    "Psychiatry", "Dental", "Cardiology", "Family Medicine",
    "Oncology", "Geriatrics", "Radiology", "Surgery",
    "General Medicine", "Orthopedics", "Pediatrics"
  ];

  const specialtyMap = {
    "psychiatry": "Psychiatry",
    "dental": "Dental",
    "cardiology": "Cardiology",
    "family medicine": "Family Medicine",
    "oncology": "Oncology",
    "geriatrics": "Geriatrics",
    "radiology": "Radiology",
    "surgery": "Surgery",
    "general medicine": "General Medicine",
    "orthopedics": "Orthopedics",
    "pediatrics": "Pediatrics"
  };

  const groupedDoctors = doctors?.reduce((acc, doctor) => {
    const displaySpecialty = specialtyMap[doctor.specialty.toLowerCase()] || "General Medicine";
    if (!acc[displaySpecialty]) acc[displaySpecialty] = [];
    acc[displaySpecialty].push(doctor);
    return acc;
  }, {});

  useEffect(() => {
    dispatch(getAllDoctors());
  }, [dispatch]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const API_URL = "http://localhost:8000";
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/default-avatar.png";
    return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
  };

  return (
    <div>
      <div className="bg-light py-1 mt-2 top">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-row">
            <div className="pt-1 mx-2">
              <p className="mb-0 text-success">Find a doctor</p>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="text-center mt-4">Loading doctors...</div>}
      {error && <div className="text-danger mt-4">Error: {error}</div>}

      <div className="Specialists">
        <div className="accordion" id="accordionExample">
          {specialties.map((specialty, index) => {
            const specialtyKey = specialty.toLowerCase().replace(/\s+/g, '-');
            const doctorsInSpecialty = groupedDoctors?.[specialty] || [];

            return (
              <div className="accordion-item" key={specialtyKey}>
                <h2 className="accordion-header" id={`heading-${specialtyKey}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${specialtyKey}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${specialtyKey}`}
                  >
                    {specialty}
                  </button>
                </h2>
                <div
                  id={`collapse-${specialtyKey}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${specialtyKey}`}
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <ul className="list-unstyled mb-0">
                      {doctorsInSpecialty.map((doctor) => (
                        <li className="p-2 border-bottom" key={doctor.user}>
                          <button
                            type="button"
                            className="border-0 bg-transparent w-100 text-start"
                            data-bs-toggle="modal"
                            data-bs-target="#doctorProfileModal"
                            onClick={() => handleDoctorSelect(doctor)}
                          >
                            <div className="d-flex justify-content-between">
                              <div className="d-flex flex-row">
                                <div>
                                  <img
                                    className="User-img-massage"
                                    src={getImageUrl(doctor.profile_image)}
                                    alt={`${doctor.first_name} ${doctor.last_name}`}
                                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                  />
                                  <span className="badge bg-success badge-dot"></span>
                                </div>
                                <div className="pt-1 mx-2">
                                  <p className="mb-0 text-success main-text">
                                    Dr. {doctor.first_name} {doctor.last_name}
                                  </p>
                                  <p className="small text-muted">
                                    {specialtyMap[doctor.specialty.toLowerCase()] || doctor.specialty} at {doctor.hospital}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                      {doctorsInSpecialty.length === 0 && (
                        <li
                          className="p-2 text-muted"
                          key={`no-doctors-${specialtyKey}`}
                        >
                          No doctors available yet in this specialty
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="modal fade" id="doctorProfileModal" tabIndex={-1} aria-labelledby="doctorProfileModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4">
            <div className="modal-header bg-light border-bottom-0 pb-0 position-relative">
              <div className="position-absolute end-0 top-0 p-3">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="w-100 text-center">
                <div className="avatar-wrapper mx-auto mb-3">
                  <img
                    className="img-fluid rounded-circle shadow-sm"
                    src={getImageUrl(selectedDoctor?.profile_image)}
                    alt={`${selectedDoctor?.first_name} ${selectedDoctor?.last_name}`}
                    onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      border: '3px solid #fff',
                      boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)'
                    }}
                  />
                </div>
                <h3 className="modal-title fs-4 text-dark mb-1" id="doctorProfileModalLabel">
                  Dr. {selectedDoctor?.first_name} {selectedDoctor?.last_name}
                </h3>
                <p className="text-muted mb-0 small">
                  {specialtyMap[selectedDoctor?.specialty.toLowerCase()] || selectedDoctor?.specialty || 'Medical Professional'}
                </p>
              </div>
            </div>
            
            <div className="modal-body pt-0">
              <div className="container-fluid">
                <div className="row g-3">
                  {/* Hospital Info */}
                  <div className="col-12">
                    <div className="bg-light rounded-3 p-3">
                      <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-building text-primary fs-5"></i>
                        <div>
                          <p className="mb-0 small text-muted">Hospital</p>
                          <p className="mb-0 fw-medium">
                            {selectedDoctor?.hospital || 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="col-md-6">
                    <div className="bg-light rounded-3 p-3 h-100">
                      <h6 className="text-uppercase text-muted small mb-3">Details</h6>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2 d-flex align-items-center gap-2">
                          <i className="bi bi-person-badge text-primary"></i>
                          <span className="small">MD, {specialtyMap[selectedDoctor?.specialty.toLowerCase()] || selectedDoctor?.specialty}</span>
                        </li>
                        <li className="mb-2 d-flex align-items-center gap-2">
                          <i className="bi bi-geo-alt text-primary"></i>
                          <span className="small">Kampala, Uganda</span>
                        </li>
                        <li className="d-flex align-items-center gap-2">
                          <i className="bi bi-award text-primary"></i>
                          <span className="small">15+ years experience</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Contact Section */}
                  <div className="col-md-6">
                    <div className="bg-light rounded-3 p-3 h-100">
                      <h6 className="text-uppercase text-muted small mb-3">Contact</h6>
                      <ul className="list-unstyled mb-0">
                        <li className="mb-2">
                          <button className="btn btn-outline-secondary w-100 text-start">
                            <i className="bi bi-envelope me-2"></i>
                            Send Message
                          </button>
                        </li>
                        <li className="mb-2">
                          <button className="btn btn-outline-secondary w-100 text-start">
                            <i className="bi bi-calendar-check me-2"></i>
                            Book Appointment
                          </button>
                        </li>
                        <li>
                          <button className="btn btn-outline-secondary w-100 text-start">
                            <i className="bi bi-telephone me-2"></i>
                            {selectedDoctor?.phone_number || 'Not available'}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="col-12">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center mt-4">
                      <button className="btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center">
                        <i className="bi bi-clipboard-check me-2"></i>
                        Instant Consultation
                      </button>
                      <button className="btn btn-success px-4 py-2 rounded-pill d-flex align-items-center">
                        <i className="bi bi-camera-video me-2"></i>
                        Video Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer bg-light border-top-0">
              <div className="w-100 text-center small text-muted">
                Available now • Last active: 2 hours ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;