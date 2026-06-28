import React from 'react';

const Results = ({ data }) => {
  if (!data) return null;

  // Extract fields matching the expected sequential operations
  const sum = data.sum !== undefined ? data.sum : '-';
  const average = data.average !== undefined ? data.average : '-';
  const count = data.count !== undefined ? data.count : '-';
  const min = data.min !== undefined ? data.min : '-';
  const max = data.max !== undefined ? data.max : '-';
  
  return (
    <div>
      <h2>Computation Results</h2>
      <div className="text-muted">Final cleartext results. Cryptographic details are intentionally hidden.</div>
      
      <div className="results-grid" style={{ marginTop: '1.5rem' }}>
        <div className="result-item">
          <div className="result-label">Sum</div>
          <div className="result-value">{sum}</div>
        </div>
        
        <div className="result-item">
          <div className="result-label">Average</div>
          <div className="result-value">{average}</div>
        </div>
        
        <div className="result-item">
          <div className="result-label">Count</div>
          <div className="result-value">{count}</div>
        </div>
        
        <div className="result-item">
          <div className="result-label">Min</div>
          <div className="result-value">{min}</div>
        </div>
        
        <div className="result-item">
          <div className="result-label">Max</div>
          <div className="result-value">{max}</div>
        </div>
      </div>
    </div>
  );
};

export default Results;