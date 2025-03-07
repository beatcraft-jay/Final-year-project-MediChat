import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctorUser, getPatientUser, logout } from "../actions/auth";
import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { Nav } from "react-bootstrap";

const Navbar = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const authData = useSelector((state) => state.auth);

  const { patient, doctor, isDoctor } = useMemo(
    () => ({
      patient: authData.patient,
      doctor: authData.doctor,
      isDoctor: authData.isDoctor,
    }),
    [authData]
  );

  const API_URL = "http://localhost:8000";

  useEffect(() => {
    if (isDoctor !== null) {
      if (isDoctor) {
        dispatch(getDoctorUser());
      } else {
        dispatch(getPatientUser());
      }
    }
  }, [dispatch, isDoctor]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/assets/img/default-avatar.jpg";
    return `${API_URL}${imagePath}`;
  };

  const user = isDoctor ? doctor : patient;

  const ModalContent = ({ isDoctor }) => {
    const [newPassword, setNewPassword] = useState("");
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    const handleSaveChanges = (e) => {
      e.preventDefault();
      console.log("New Password:", newPassword);
      console.log("Two-Factor Enabled:", twoFactorEnabled);
    };

    return (
      <div
        className="modal fade"
        id="profile"
        tabIndex={-1}
        aria-labelledby="profileModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content overflow-hidden">
            <div className="modal-body p-0">
              <div className="row g-0">
                {/* Navigation Sidebar */}
                <div className="col-12 col-md-4 bg-gradient-primary p-4 text-white">
                  <Nav variant="pills" className="flex-md-column gap-2">
                    <Nav.Item>
                      <Nav.Link
                        eventKey="profile"
                        className="text-white rounded-pill d-flex align-items-center"
                        active={activeTab === "profile"}
                        onClick={() => setActiveTab("profile")}
                      >
                        <i className="bi bi-person fs-5 me-3"></i>
                        <span className="d-none d-md-block">Profile</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="account"
                        className="text-white rounded-pill d-flex align-items-center"
                        active={activeTab === "account"}
                        onClick={() => setActiveTab("account")}
                      >
                        <i className="bi bi-person-vcard fs-5 me-3"></i>
                        <span className="d-none d-md-block">Account</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="storage"
                        className="text-white rounded-pill d-flex align-items-center"
                        active={activeTab === "storage"}
                        onClick={() => setActiveTab("storage")}
                      >
                        <i className="bi bi-floppy fs-5 me-3"></i>
                        <span className="d-none d-md-block">Storage</span>
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link
                        eventKey="help"
                        className="text-white rounded-pill d-flex align-items-center"
                        active={activeTab === "help"}
                        onClick={() => setActiveTab("help")}
                      >
                        <i className="bi bi-info-circle fs-5 me-3"></i>
                        <span className="d-none d-md-block">Help</span>
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>

                {/* Content Area */}
                <div className="col-12 col-md-8 p-4">
                  <div className="tab-content">
                    {activeTab === "profile" && (
                      <div className="animate-slideIn">
                        <h3 className="mb-4 text-primary main-text-srt">
                          Profile Settings
                        </h3>
                        <div className="text-center mb-4 position-relative">
                          <div className="avatar-edit">
                            <img
                              className="rounded-circle shadow-lg"
                              src={
                                user?.profile_image
                                  ? getImageUrl(user.profile_image)
                                  : "/assets/img/default-avatar.jpg"
                              }
                              alt="Profile"
                              style={{
                                width: "140px",
                                height: "140px",
                                objectFit: "cover",
                              }}
                            />
                            <button className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle shadow-sm">
                              <i className="bi bi-pencil"></i>
                            </button>
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="form-label text-muted small">
                            Full Name
                          </label>
                          <div className="fs-5 fw-medium text-dark">
                            {isDoctor
                              ? `Dr. ${user?.first_name} ${user?.last_name}`
                              : `${user?.title} ${user?.first_name} ${user?.last_name}`}
                          </div>
                        </div>
                        <div className="row g-3">
                          {isDoctor ? (
                            <>
                              <div className="col-md-6">
                                <label className="form-label text-muted small">
                                  Hospital
                                </label>
                                <div className="fs-5 fw-medium text-dark">
                                  {user?.hospital || "Not specified"}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label text-muted small">
                                  Specialty
                                </label>
                                <div className="fs-5 fw-medium text-dark">
                                  {user?.specialty || "Not specified"}
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="col-md-6">
                                <label className="form-label text-muted small">
                                  Medical History
                                </label>
                                <div className="fs-5 fw-medium text-dark">
                                  {user?.medical_history || "No medical history"}
                                </div>
                              </div>
                              <div className="col-md-6">
                                <label className="form-label text-muted small">
                                  Phone Number
                                </label>
                                <div className="fs-5 fw-medium text-dark">
                                  {user?.phone_number || "Not available"}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === "account" && (
                      <div className="animate-slideIn">
                        <h3 className="mb-4 text-primary main-text-srt">
                          Account Settings
                        </h3>
                        <form onSubmit={handleSaveChanges}>
                          
                          <input
                            type="email"
                            name="username"
                            value={user?.email || ""}
                            autoComplete="username"
                            readOnly 
                            style={{ display: "none" }}
                          />
                          <div className="mb-3">
                            <label className="form-label text-muted small">
                              Email Address
                            </label>
                            <div className="fs-5 fw-medium text-dark">
                            {user?.email || "No email associated"}
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label text-muted small">
                              Change Password
                            </label>
                            <input
                              type="password"
                              className="form-control border-primary"
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              autoComplete="new-password"
                            />
                          </div>
                          <div className="form-check form-switch mb-4">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="twoFactor"
                              style={{ width: "3em", height: "1.5em" }}
                              checked={twoFactorEnabled}
                              onChange={(e) =>
                                setTwoFactorEnabled(e.target.checked)
                              }
                            />
                            <label
                              className="form-check-label text-muted small"
                              htmlFor="twoFactor"
                            >
                              Enable Two-Factor Authentication
                            </label>
                          </div>
                        </form>
                      </div>
                    )}

                    {activeTab === "storage" && (
                      <div className="animate-slideIn">
                        <h3 className="mb-4 text-primary main-text-srt">
                          Storage Management
                        </h3>
                        <div className="progress mb-4" style={{ height: "20px" }}>
                          <div
                            className="progress-bar bg-gradient-success"
                            role="progressbar"
                            style={{ width: "65%" }}
                          >
                            65% Used
                          </div>
                        </div>
                        <div className="mb-3">
                          <p className="text-muted small">
                            Total Storage: 15GB/20GB
                          </p>
                          <button className="btn btn-outline-primary">
                            <i className="bi bi-cloud-arrow-up me-2"></i>Upgrade
                            Storage
                          </button>
                        </div>
                        <div className="alert alert-primary">
                          <i className="bi bi-info-circle me-2"></i>
                          Manage your stored files and clear unused space
                        </div>
                      </div>
                    )}

                    {activeTab === "help" && (
                      <div className="animate-slideIn">
                        <h3 className="mb-4 text-primary main-text-srt">
                          Help & Support
                        </h3>
                        <div className="mb-4">
                          <h5 className="text-primary">
                            <i className="bi bi-question-circle me-2"></i>FAQs
                          </h5>
                          <div className="list-group">
                            <a
                              href="#"
                              className="list-group-item list-group-item-action border-0"
                            >
                              How to reset password?
                            </a>
                            <a
                              href="#"
                              className="list-group-item list-group-item-action border-0"
                            >
                              Updating profile information
                            </a>
                            <a
                              href="#"
                              className="list-group-item list-group-item-action border-0"
                            >
                              Storage management guide
                            </a>
                          </div>
                        </div>
                        <div className="card border-primary">
                          <div className="card-body">
                            <h5 className="card-title text-primary">
                              <i className="bi bi-headset me-2"></i>Contact
                              Support
                            </h5>
                            <p className="card-text text-muted">
                              Email: support@medichat.com
                              <br />
                              Phone: +256 700 123 567
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                    <button
                      className="btn btn-link text-danger text-decoration-none"
                      onClick={() => dispatch(logout())}
                    >
                      <i className="bi bi-box-arrow-left me-2"></i>Log Out
                    </button>
                    <div>
                      <button
                        className="btn btn-outline-secondary me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSaveChanges}
                      >
                        <i className="bi bi-save me-2"></i>Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <img
            className="logo"
            src="assets/img/logo.png"
            alt="MEDiChat Logo"
            style={{ width: "40px", height: "40px" }}
          />
          <span className="fs-5 text-primary ms-2 main-text-srt">MEDiChat</span>
        </div>

        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-link text-decoration-none p-0"
            data-bs-toggle="modal"
            data-bs-target="#profile"
          >
            <div className="d-flex align-items-center">
              <span className="text-dark me-2 fw-medium">
                {user ? (
                  isDoctor
                    ? `Dr. ${user.first_name} ${user.last_name}`
                    : `${user.title} ${user.first_name} ${user.last_name}`
                ) : (
                  "Loading..."
                )}
              </span>
              <div className="position-relative">
                <img
                  className="rounded-circle shadow-sm"
                  src={
                    user?.profile_image
                      ? getImageUrl(user.profile_image)
                      : "/assets/img/default-avatar.jpg"
                  }
                  alt="Profile"
                  style={{ width: "45px", height: "45px", objectFit: "cover" }}
                />
                <span className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-1"></span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <ModalContent isDoctor={isDoctor} />
    </nav>
  );
};

export default Navbar;