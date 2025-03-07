import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import { BiSmile, BiSend, BiPlus } from 'react-icons/bi';
import { connect } from 'react-redux';
import { getStatuses, createStatus } from '../actions/auth';
import { getAllDoctors } from '../actions/doctorActions'; 
import PropTypes from 'prop-types';

const CreateStatus = ({ onClose, createStatus }) => {
  const [formData, setFormData] = useState({
    caption: '',
    status_type: 'text',
    status_text: '',
    status_image: null,
    status_video: null,
    background_color: '#e8f4ff',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStatus(formData);
      onClose();
    } catch (error) {
      console.error('Error creating status:', error);
    }
  };

  return (
    <div className="create-status-overlay">
      <div className="create-status-modal">
        <div className="modal-header">
          <h2>Create New Status</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="status-form">
          <div className="form-group">
            <label>Status Type:</label>
            <select
              value={formData.status_type}
              onChange={(e) => setFormData({ ...formData, status_type: e.target.value })}
              className="type-select"
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          {formData.status_type !== 'text' && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="caption-input"
              />
            </div>
          )}

          {formData.status_type === 'text' && (
            <div className="form-group">
            <div className="color-picker">
              <label>Background Color:</label>
              <input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
              />
              <span className="color-preview" 
                    style={{ backgroundColor: formData.background_color }}>
              </span>
            </div>
              <textarea
                value={formData.status_text}
                onChange={(e) => setFormData({ ...formData, status_text: e.target.value })}
                style={{ backgroundColor: formData.background_color }}
                className="status-textarea"
                placeholder="What's on your mind?"
              />
            </div>
          )}

          {formData.status_type === 'image' && (
            <div className="form-group">
              <label className="file-upload">
                Choose Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, status_image: e.target.files[0] })}
                  hidden
                />
              </label>
            </div>
          )}

          {formData.status_type === 'video' && (
            <div className="form-group">
              <label className="file-upload">
                Choose Video
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFormData({ ...formData, status_video: e.target.files[0] })}
                  hidden
                />
              </label>
            </div>
          )}

          <button type="submit" className="submit-btn">Post Status</button>
        </form>
      </div>
    </div>
  );
};

const News = ({ statuses, loading, getStatuses, createStatus, getAllDoctors, isDoctor, doctors }) => {
  const [message, setMessage] = useState('');
  const [showCreateStatus, setShowCreateStatus] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    console.log('Fetching statuses and doctors...');
    getStatuses();
    getAllDoctors();
  }, [getStatuses, getAllDoctors]);

  useEffect(() => {
    console.log('Statuses:', statuses);
    console.log('Doctors:', doctors);
  }, [statuses, doctors]);

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    console.log('Fetching statuses and doctors...');
    getStatuses();
    getAllDoctors().catch(error => {
      console.error('Error loading doctors:', error);
    });
  }, [getStatuses, getAllDoctors]);

  return (
    <div className="status-container">
      {isDoctor && (
        <button
          className="floating-create-btn"
          onClick={() => setShowCreateStatus(true)}
        >
          <BiPlus className="plus-icon" />
        </button>
      )}

      {showCreateStatus && (
        <CreateStatus onClose={() => setShowCreateStatus(false)} createStatus={createStatus} />
      )}

      <div className="status-progress">
        <div className="progress-container">
          {[0, 1, 2].map((_, index) => (
            <div key={index} className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="status-carousel">
        <div id="statusCarousel" className="carousel slide">
          <div className="carousel-inner">
            {Array.isArray(statuses) && statuses.length > 0 ? (
              statuses.map((status, index) => {
                const doctor = doctors.find(d => d.user === status.doctor) || {};

                return (
                  <div
                    key={status.id}
                    className={`carousel-item ${index === 0 ? 'active' : ''}`}
                  >
                    <div className="status-header">
                      <div className="sender-info">
                        <img
                          className="sender-image"
                          src={doctor.profile_image || 'assets/img/default-user.png'}
                          alt={`${doctor.first_name} ${doctor.last_name}`}
                        />
                        <div className="sender-details">
                          <h5 className="sender-name main-text">
                          Dr. {doctor.first_name} {doctor.last_name}
                          </h5>
                          <p className="sender-time">
                            {status.status_posted_at
                              ? `${formatDistanceToNow(
                                  new Date(status.status_posted_at.replace(' ', 'T') + 'Z')
                                )} ago`
                              : 'Time unavailable'}
                          </p>
                        </div>
                      </div>
                      <div className="status-actions">
                        <button className="action-btn">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                      </div>
                    </div>

                    <div className="media-container">
                      {status.status_type === 'image' && status.status_image ? (
                        <img
                          src={status.status_image}
                          className="status-media"
                          alt="Status"
                        />
                      ) : status.status_type === 'video' && status.status_video ? (
                        <video
                          src={status.status_video}
                          className="status-media"
                          controls
                          alt="Status Video"
                        />
                      ) : status.status_type === 'text' && status.status_text ? (
                        <div
                          className="status-text-content status-text"
                          style={{ 
                            backgroundColor: status.background_color || '#e8f4ff',
                            color: '#2c3e50',
                            padding: '1rem',
                            borderRadius: '8px'
                          }}
                        >
                          <h3>{status.status_text}</h3>
                        </div>
                      ) : (
                        <div className="no-content">No content available</div>
                      )}
                    </div>

                    {(status.status_type === 'image' || status.status_type === 'video') && (
                      <div className="status-caption">
                        <p>{status.caption}</p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="carousel-item active">
                <div className="no-statuses">No statuses available</div>
              </div>
            )}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#statusCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#statusCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      <div className="status-input-container">
        <div className="input-wrapper">
          <button
            className="emoji-btn"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <BiSmile className="emoji-icon" />
          </button>
          <input
            type="text"
            className="status-input"
            placeholder="Comment or ask a question"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="send-btn">
            <BiSend className="send-icon" />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              skinTonesDisabled
              searchDisabled
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

News.propTypes = {
  statuses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      caption: PropTypes.string,
      status_type: PropTypes.string.isRequired,
      status_text: PropTypes.string,
      status_image: PropTypes.string,
      status_video: PropTypes.string,
      background_color: PropTypes.string,
      status_posted_at: PropTypes.string.isRequired,
      doctors: PropTypes.arrayOf(
        PropTypes.shape({
          user: PropTypes.number.isRequired, 
          first_name: PropTypes.string.isRequired,
          last_name: PropTypes.string.isRequired,
          profile_image: PropTypes.string,
        })
      ),
    })
  ),
  loading: PropTypes.bool,
  getStatuses: PropTypes.func.isRequired,
  createStatus: PropTypes.func.isRequired,
  getAllDoctors: PropTypes.func.isRequired, 
  isDoctor: PropTypes.bool.isRequired,
  doctors: PropTypes.array.isRequired,
};

News.defaultProps = {
  statuses: [],
  loading: false,
  isDoctor: false,
  doctors: [],
};

const mapStateToProps = (state) => ({
  statuses: state.status.statuses,
  doctors: state.doctorsList.doctors || state.doctors || [], 
  loading: state.status.loading,
  isDoctor: state.auth.user?.is_doctor || false,
});

export default connect(mapStateToProps, { getStatuses, createStatus, getAllDoctors })(News);