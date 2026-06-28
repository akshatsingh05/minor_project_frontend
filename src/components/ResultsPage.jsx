import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Results from './Results';
import Chart from './Chart';
import { useLocation } from "react-router-dom";

const API_URL = 'import.meta.env.VITE_API_URL';

const ResultsPage = () => {
  const location = useLocation();
  const source = location.state?.source;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!source) {
      setError("No data source selected.");
      setLoading(false);
      return;
    }
    const fetchComputations = async () => {
      setLoading(true);
      setError('');
      
      const operations = ['sum', 'average', 'count', 'min', 'max'];
      let aggregatedResults = {};
      let finalChartData = null;

      try {
        // Sequential API calls to avoid race conditions
        for (let i = 0; i < operations.length; i++) {
          const op = operations[i];
          const res = await axios.post(`${API_URL}/compute`, { 
            operation: op,
            source: source
          });
          if (source === 'manual') {
            if (res.data && res.data.result !== undefined) {
              if (typeof res.data.result === 'object') {
                aggregatedResults = { ...aggregatedResults, ...res.data.result };
              } else {
                aggregatedResults[op] = res.data.result;
              }
            }
            
            if (res.data && res.data.chart) {
              finalChartData = res.data.chart;
            }
          } else {
            if (res.data && res.data.results) {
              for (const col of Object.keys(res.data.results)) {
                if (!aggregatedResults[col]) aggregatedResults[col] = {};
                if (typeof res.data.results[col] === 'object') {
                  aggregatedResults[col] = { ...aggregatedResults[col], ...res.data.results[col] };
                } else {
                  aggregatedResults[col][op] = res.data.results[col];
                }
              }
            } else if (res.data && res.data.result !== undefined) {
              // Fallback
              if (typeof res.data.result === 'object') {
                aggregatedResults = { ...aggregatedResults, ...res.data.result };
              } else {
                aggregatedResults[op] = res.data.result;
              }
            }
            
            if (res.data && res.data.charts) {
              if (!finalChartData) finalChartData = {};
              finalChartData = { ...finalChartData, ...res.data.charts };
            } else if (res.data && res.data.chart) {
              finalChartData = res.data.chart;
            }
          }
        }
        
        setResults(aggregatedResults);
        setChartData(finalChartData);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || 'An error occurred during computation.');
      } finally {
        setLoading(false);
      }
    };

    fetchComputations();
  }, [source]);

  return (
    <div className="container">
      <h1>Auditable Secure Computation System</h1>
      <div style={{ width: '100%', margin: '0 auto' }}>
        <button className="btn" onClick={() => navigate('/')} style={{ marginBottom: '1rem', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--border-color)', width: 'auto' }}>
          ← Back to Home
        </button>

        {loading && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h2>Computing...</h2>
            <div className="loader" style={{ marginTop: '1rem' }}></div>
          </div>
        )}

        {error && !loading && (
          <div className="error-message">
            {error}
          </div>
        )}

        {!loading && !error && results && (
          source === 'manual' ? (
            <div className="grid-layout">
              <div className="glass-card full-width">
                <Results data={results} />
              </div>

              {chartData && (
                <div className="glass-card full-width">
                  <Chart data={chartData} />
                </div>
              )}
            </div>
          ) : (
            <div className="column-grid">
              {Object.keys(results).map((col) => (
                <div className="glass-card column-card" key={col}>
                  <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>{col}</h3>
                  <Results data={results[col]} />
                  {chartData && chartData[col] && (
                    <div style={{ marginTop: '2rem' }}>
                      <Chart data={chartData[col]} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
