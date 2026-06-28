import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'import.meta.env.VITE_API_URL';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please provide a CSV file.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    setUploading(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.post(`${API_URL}/upload-dataset`, formData);
      setSuccess('Dataset uploaded successfully!');
      setHasData(true);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload dataset.');
    } finally {
      setUploading(false);
    }
  };

  const handleCompute = () => {
    if (!hasData) {
      setError('Cannot compute: No dataset has been uploaded yet.');
      return;
    }
    navigate('/results', { state: { source: "upload" } });
  };

  return (
    <div className="container">
      <h1>Auditable Secure Computation System</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '1rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
          ← Back to Home
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="glass-card">
          <h2>Upload Dataset</h2>
          <div className="text-muted">Upload a CSV file for computation</div>
          <form onSubmit={handleUpload} style={{ marginBottom: '2rem' }}>
            <div className="file-upload-wrapper">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                required
              />
              {file ? (
                <div>Selected: <strong style={{ color: 'var(--primary)' }}>{file.name}</strong></div>
              ) : (
                <div>Drag & Drop your CSV file here, or click to browse</div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload CSV'}
            </button>
          </form>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

          <h2>Computation</h2>
          <div className="text-muted">Compute metrics on the uploaded dataset.</div>
          <button 
            className="btn btn-primary btn-compute" 
            onClick={handleCompute}
          >
            Trigger Computation
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
