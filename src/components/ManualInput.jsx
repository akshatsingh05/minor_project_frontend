import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'import.meta.env.VITE_API_URL';

const ManualInput = () => {
  const [value, setValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value && value !== 0) return;
    
    setSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      console.log("Sending value:", value)

      await axios.post(`${API_URL}/submit-single`, {
        value: Number(value)
      });

      setSuccess('Value submitted successfully!');
      setHasData(true);
      setValue('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit value.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompute = () => {
    if (!hasData) {
      setError('Cannot compute: No data has been submitted yet.');
      return;
    }
    navigate('/results', { state: { source: "manual" } });
  };

  const handleReset = async () => {
    try {
      await axios.post(`${API_URL}/reset-manual`);
      setSuccess("Manual data reset!");
    } catch (err) {
      setError("Failed to reset data");
    }
  };

  return (
    <div className="container">
      <h1>Auditable Secure Computation System</h1>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '1rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)' }}>
          ← Back to Home
        </button>
        <button onClick={handleReset} className="btn">
          Reset Data
        </button>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="glass-card">
          <h2>Manual Input</h2>
          <div className="text-muted">Enter a single numeric value</div>
          <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
            <input
              type="number"
              className="input-field"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., 42"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Value'}
            </button>
          </form>

          <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

          <h2>Computation</h2>
          <div className="text-muted">Compute metrics on the submitted data.</div>
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

export default ManualInput;
