const CreateStatus = ({ onClose }) => {
    const [formData, setFormData] = useState({
        caption: '',
        status_type: 'text',
        status_text: '',
        status_image: null
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('caption', formData.caption);
        data.append('status_type', formData.status_type);
        
        if (formData.status_type === 'text') {
            data.append('status_text', formData.status_text);
        } else if (formData.status_type === 'image') {
            data.append('status_image', formData.status_image);
        }

        try {
            await axios.post('/api/status/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Refresh status list or redirect
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
                  onChange={e => setFormData({...formData, status_type: e.target.value})}
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
                    onChange={e => setFormData({...formData, caption: e.target.value})}
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
                      value={formData.background_color || '#ffffff'}
                      onChange={e => setFormData({...formData, background_color: e.target.value})}
                    />
                  </div>
                  <textarea
                    value={formData.status_text}
                    onChange={e => setFormData({...formData, status_text: e.target.value})}
                    style={{ backgroundColor: formData.background_color }}
                    className="status-textarea"
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
                      onChange={e => setFormData({...formData, status_image: e.target.files[0]})}
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
                      onChange={e => setFormData({...formData, status_video: e.target.files[0]})}
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