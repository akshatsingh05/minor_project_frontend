import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1>Auditable Secure Computation System</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <button 
          className="btn btn-large" 
          onClick={() => navigate('/manual')}
        >
          Enter Data Manually
        </button>
        <button 
          className="btn btn-large" 
          onClick={() => navigate('/upload')}
        >
          Upload Dataset (CSV)
        </button>
      </div>
    </div>
  );
};

export default Home;
